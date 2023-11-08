import json
import requests
import datetime
import tqdm

startDate = datetime.datetime(2018, 6, 1)
today = datetime.datetime.today()

months_to_add = ((today.year - startDate.year) * 12 + today.month - startDate.month)
delta = datetime.timedelta(30)

regionid = 17
currentDate = startDate

file = "./sql.txt"
f = open(file, 'w')

for id in range(regionid):
    for i in tqdm.tqdm(range(months_to_add)):
        dateFrom = currentDate.strftime("%Y-%m-%d")
        dateFromurl = dateFrom + "T00:00Z"
        dateTo = (currentDate + delta).strftime("%Y-%m-%d") + "T00:00Z"
        dateTourl = dateTo + "T00:00Z"

        url = f'https://api.carbonintensity.org.uk/regional/intensity/{dateFrom}/{dateTo}/regionid/{regionid}'
        headers = {
            'Accept': 'application/json'
        }

        r = requests.get(url, headers=headers)
        data = json.loads(r.text)

        regionid = data["data"]["regionid"]
        dnoregion = data["data"]["dnoregion"]
        shortname = data["data"]["shortname"]

        for item in data["data"]["data"]:
            date = item["from"].split("T")[0]
            time = item["from"].split("T")[1].split("Z")[0]
            intensity_forecast = item["intensity"]["forecast"]
            generationmix = json.dumps(item["generationmix"])
            # 创建SQL语句
            sql = f"INSERT INTO region (regionid, dnoregion, shortname, date, time, forecast, data) VALUES ({regionid}, '{dnoregion}', '{shortname}', '{date}', '{time}', '{intensity_forecast}', '{generationmix}');\n"
            f.write(sql)
        currentDate += delta
f.close()
