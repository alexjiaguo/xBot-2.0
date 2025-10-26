#!/usr/bin/env python3
"""
Tesla Shop Catalog Scraper
Scrapes product SKUs and details from shop.tesla.cn

IMPORTANT: Ensure compliance with Tesla's Terms of Service
and implement proper rate limiting before use.
"""

import requests
from bs4 import BeautifulSoup
import json
import csv
import time
import re
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TeslaShopScraper:
    def __init__(self, base_url: str = "https://shop.tesla.cn", delay: float = 1.0):
        self.base_url = base_url
        self.delay = delay  # Delay between requests to be respectful
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
        self.products = []
        
    def get_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetch and parse a page with error handling"""
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            time.sleep(self.delay)  # Rate limiting
            return BeautifulSoup(response.content, 'html.parser')
        except requests.RequestException as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    def find_product_categories(self) -> List[str]:
        """Find all product category URLs"""
        soup = self.get_page(self.base_url)
        if not soup:
            return []
        
        categories = []
        
        # Look for navigation menus, category links
        nav_links = soup.find_all('a', href=True)
        for link in nav_links:
            href = link.get('href')
            if href and ('/product' in href or '/category' in href):
                full_url = urljoin(self.base_url, href)
                if full_url not in categories:
                    categories.append(full_url)
        
        # Look for category-specific patterns
        category_patterns = [
            '/product/',
            '/category/',
            '/collections/',
            '/shop/'
        ]
        
        for pattern in category_patterns:
            pattern_links = soup.find_all('a', href=re.compile(pattern))
            for link in pattern_links:
                href = link.get('href')
                if href:
                    full_url = urljoin(self.base_url, href)
                    if full_url not in categories:
                        categories.append(full_url)
        
        logger.info(f"Found {len(categories)} category URLs")
        return categories
    
    def extract_product_info(self, product_url: str) -> Optional[Dict]:
        """Extract product information from a product page"""
        soup = self.get_page(product_url)
        if not soup:
            return None
        
        product_info = {
            'url': product_url,
            'sku': None,
            'name': None,
            'price': None,
            'description': None,
            'images': [],
            'availability': None,
            'category': None
        }
        
        try:
            # Extract SKU from URL or page content
            sku_match = re.search(r'sku=([^&]+)', product_url)
            if sku_match:
                product_info['sku'] = sku_match.group(1)
            
            # Try to find SKU in page content
            if not product_info['sku']:
                sku_elements = soup.find_all(text=re.compile(r'SKU|Product Code|Item #'))
                for element in sku_elements:
                    parent = element.parent
                    if parent:
                        sku_text = parent.get_text(strip=True)
                        sku_match = re.search(r'[A-Z0-9\-]+', sku_text)
                        if sku_match:
                            product_info['sku'] = sku_match.group()
                            break
            
            # Extract product name
            name_selectors = [
                'h1.product-title',
                'h1[data-testid="product-title"]',
                '.product-name h1',
                'h1',
                '.product-title'
            ]
            
            for selector in name_selectors:
                name_elem = soup.select_one(selector)
                if name_elem:
                    product_info['name'] = name_elem.get_text(strip=True)
                    break
            
            # Extract price
            price_selectors = [
                '.price',
                '.product-price',
                '[data-testid="price"]',
                '.cost',
                '.amount'
            ]
            
            for selector in price_selectors:
                price_elem = soup.select_one(selector)
                if price_elem:
                    price_text = price_elem.get_text(strip=True)
                    price_match = re.search(r'[\d,]+\.?\d*', price_text)
                    if price_match:
                        product_info['price'] = price_text
                        break
            
            # Extract description
            desc_selectors = [
                '.product-description',
                '.description',
                '[data-testid="description"]',
                '.product-details'
            ]
            
            for selector in desc_selectors:
                desc_elem = soup.select_one(selector)
                if desc_elem:
                    product_info['description'] = desc_elem.get_text(strip=True)[:500]  # Limit length
                    break
            
            # Extract images
            img_elements = soup.find_all('img', src=True)
            for img in img_elements:
                src = img.get('src')
                if src and ('product' in src.lower() or 'tesla' in src.lower()):
                    full_img_url = urljoin(self.base_url, src)
                    product_info['images'].append(full_img_url)
            
            # Extract availability
            availability_selectors = [
                '.availability',
                '.stock-status',
                '[data-testid="availability"]',
                '.in-stock',
                '.out-of-stock'
            ]
            
            for selector in availability_selectors:
                avail_elem = soup.select_one(selector)
                if avail_elem:
                    product_info['availability'] = avail_elem.get_text(strip=True)
                    break
            
            logger.info(f"Extracted product: {product_info['name']} (SKU: {product_info['sku']})")
            return product_info
            
        except Exception as e:
            logger.error(f"Error extracting product info from {product_url}: {e}")
            return None
    
    def find_products_on_page(self, page_url: str) -> List[str]:
        """Find all product URLs on a category/listing page"""
        soup = self.get_page(page_url)
        if not soup:
            return []
        
        product_urls = []
        
        # Look for product links
        product_selectors = [
            'a[href*="/product/"]',
            '.product-item a',
            '.product-card a',
            '[data-testid="product-link"]'
        ]
        
        for selector in product_selectors:
            links = soup.select(selector)
            for link in links:
                href = link.get('href')
                if href:
                    full_url = urljoin(self.base_url, href)
                    if full_url not in product_urls:
                        product_urls.append(full_url)
        
        # Also look for any links containing 'product' in the URL
        all_links = soup.find_all('a', href=True)
        for link in all_links:
            href = link.get('href')
            if href and '/product/' in href:
                full_url = urljoin(self.base_url, href)
                if full_url not in product_urls:
                    product_urls.append(full_url)
        
        logger.info(f"Found {len(product_urls)} products on {page_url}")
        return product_urls
    
    def scrape_catalog(self, max_products: int = None) -> List[Dict]:
        """Main method to scrape the entire catalog"""
        logger.info("Starting Tesla shop catalog scraping...")
        
        # Step 1: Find all category pages
        categories = self.find_product_categories()
        
        # Step 2: Find all product URLs
        all_product_urls = set()
        
        for category_url in categories:
            product_urls = self.find_products_on_page(category_url)
            all_product_urls.update(product_urls)
            
            # Also check for pagination
            self._handle_pagination(category_url, all_product_urls)
        
        # Step 3: Extract product information
        product_urls_list = list(all_product_urls)
        if max_products:
            product_urls_list = product_urls_list[:max_products]
        
        logger.info(f"Processing {len(product_urls_list)} products...")
        
        for i, product_url in enumerate(product_urls_list, 1):
            logger.info(f"Processing product {i}/{len(product_urls_list)}")
            product_info = self.extract_product_info(product_url)
            if product_info:
                self.products.append(product_info)
        
        logger.info(f"Scraping completed. Found {len(self.products)} products.")
        return self.products
    
    def _handle_pagination(self, base_url: str, product_urls: set):
        """Handle pagination on category pages"""
        # Look for pagination links and scrape additional pages
        soup = self.get_page(base_url)
        if not soup:
            return
        
        # Find pagination links
        pagination_selectors = [
            '.pagination a',
            '.page-numbers a',
            '[data-testid="pagination"] a',
            'a[href*="page="]'
        ]
        
        for selector in pagination_selectors:
            pagination_links = soup.select(selector)
            for link in pagination_links:
                href = link.get('href')
                if href and 'page=' in href:
                    page_url = urljoin(self.base_url, href)
                    page_products = self.find_products_on_page(page_url)
                    product_urls.update(page_products)
    
    def save_to_json(self, filename: str = "tesla_products.json"):
        """Save scraped data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.products, f, indent=2, ensure_ascii=False)
        logger.info(f"Data saved to {filename}")
    
    def save_to_csv(self, filename: str = "tesla_products.csv"):
        """Save scraped data to CSV file"""
        if not self.products:
            logger.warning("No products to save")
            return
        
        fieldnames = ['sku', 'name', 'price', 'url', 'description', 'availability', 'images']
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for product in self.products:
                # Convert images list to string
                row = product.copy()
                row['images'] = '; '.join(product.get('images', []))
                writer.writerow(row)
        
        logger.info(f"Data saved to {filename}")

def main():
    """Example usage"""
    scraper = TeslaShopScraper(delay=2.0)  # 2 second delay between requests
    
    try:
        # Scrape catalog (limit to 50 products for testing)
        products = scraper.scrape_catalog(max_products=50)
        
        # Save results
        scraper.save_to_json("tesla_shop_products.json")
        scraper.save_to_csv("tesla_shop_products.csv")
        
        print(f"\nScraping completed successfully!")
        print(f"Total products found: {len(products)}")
        print(f"Results saved to: tesla_shop_products.json and tesla_shop_products.csv")
        
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
    except Exception as e:
        logger.error(f"Scraping failed: {e}")

if __name__ == "__main__":
    main()
