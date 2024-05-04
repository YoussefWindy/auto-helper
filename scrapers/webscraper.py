import requests
import argparse
import json
from bs4 import BeautifulSoup

def parse(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text,'lxml')
    cars = soup.find_all('div',{'class':'vehicle-card-main js-gallery-click-card'})
    data = []
    for car in cars:
         rawHref = car.find('a')['href']
         href = rawHref if 'https' in rawHref else 'https://cars.com'+rawHref
         name = car.find('h2',{'class':'title'}).text
         price = car.find('span',{'class':'primary-price'}).text
         mileage = car.find(attrs={'class':'mileage'}).text if car.find(attrs={'class':'mileage'}) else None
         dealer = car.find(attrs={'class':'dealer-name'}).text.replace('\n','') if car.find(attrs={'class':'dealer-name'}) else None
         reviews = car.find('span',{'class':'test1 sds-rating__link sds-button-link'}).text.replace('(','').replace(')'                                                                                                                                                                                                                                    
,'') if car.find('span',{'class':'test1 sds-rating__link sds-button-link'}) else None
         location = car.find(attrs={'class':'miles-from'}).text.replace('\n','')
         rating = car.find('span',{'class':'sds-rating__count'}).text if car.find('span',{'class':'sds-rating__count'}) else None
         stock_type = car.find('p',{'class':'stock-type'}).text
         try:
            img_url = car.find('img', {'class': 'vehicle-image'})['data-src']
         except:
            img_url = car.find('img', {'class': 'vehicle-image'})['src']
         newResponse = requests.get(href)
         newSoup = BeautifulSoup(newResponse.text,'lxml')
         print('getting details of'+ name)
         description = newSoup.find('dl',{'class':'fancy-description-list'})
         rawBasicKeys = description.find_all('dt')
         basicKeys = [key.text.replace('\n',' ') for key in rawBasicKeys]
         rawBasicValues = description.find_all('dd')
         basicValues = [value.text.replace('\n',' ') for value in rawBasicValues]
         basics = dict(zip(basicKeys,basicValues))
         
        

         data.append({
              "Name":name,
              "Price":price,
              "URL":href,
              "Mileage":mileage,
              "Stock-Type":stock_type,
              "Dealer Details":{"Name":dealer,
                                "Rating":rating,
                                "Review Count":reviews,
                                "Location":location
                                },
                   
              "Specifications":basics,
              "Image URL": img_url
         }
         )
    return data


def getArgs():
    argparser = argparse.ArgumentParser()
    argparser.add_argument('max_pages',help="Maximum number of pages you want to scrape")
    args = argparser.parse_args()
    max_pages = args.max_pages
    return max_pages


def paginate(max_pages):
    carData = []
    for i in range(int(max_pages)):
        a = str(i + 1)
        url = "https://www.cars.com/shopping/results/?dealer_id=&keyword=&list_price_max=&list_price_min=&makes[]=&maximum_distance=500&mileage_max=&monthly_payment=&page=" + a + "&page_size=20&sort=best_match_desc&stock_type=used&year_max=&year_min=&zip="
        scraped_data = parse(url)
        print(url)
        for data in scraped_data:
            carData.append(data)
    return carData


def writeData(carData):
    if carData:
        print(len(carData))
        with open('cars.json','w',encoding='utf-8') as jsonfile:
            json.dump(carData,jsonfile,indent=4,ensure_ascii=False)
    else:
        print("No data scraped")


if __name__=="__main__":
# get arguments from the command line
    max_pages = getArgs()
# extract data
    carData=paginate(max_pages)
# write data
    writeData(carData)
