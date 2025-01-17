const axios = require("axios");
const moment = require("moment");

const exchangeObject = [
  {
    name: "binance",
    spotURL: "https://api.binance.com/api/v3/avgPrice?symbol=CHANGETOKENUSDT",
    derivativeURL:
      "https://fapi.binance.com/fapi/v1/premiumIndex?symbol=CHANGETOKENUSDT",
    derivativeFundingRateURL:
      "https://fapi.binance.com/fapi/v1/fundingRate?symbol=CHANGETOKENUSDT&limit=1",
    derivativeFundingRateHistoryURL:
      "https://fapi.binance.com/fapi/v1/fundingRate?symbol=CHANGETOKENUSDT&limit=1",
  },
  {
    name: "huobi",
    spotURL: "https://api.huobi.pro/market/trade?symbol=changetokenusdt", //sumbol btcusdt
    derivativeURL:
      "https://api.hbdm.com/linear-swap-ex/market/trade?contract_code=CHANGETOKEN-USDT", //symbol BTC-USDT
    derivativeFundingRateURL:
      "https://api.hbdm.com/linear-swap-api/v1/swap_funding_rate?contract_code=CHANGETOKEN-USDT", //symbol BTC-USDT
    derivativeFundingRateHistoryURL:
      "https://api.hbdm.com/linear-swap-api/v1/swap_historical_funding_rate?contract_code=CHANGETOKEN-USDT&page_size=50",
  },
  {
    name: "mexc",
    spotURL:
      "https://api.mexc.com/api/v3/ticker/bookTicker?symbol=CHANGETOKENUSDT", //symbol BTCUSDT
    derivativeURL:
      "https://contract.mexc.com/api/v1/contract/index_price/CHANGETOKEN_USDT", //symbol BTC_USDT
    derivativeFundingRateURL:
      "https://contract.mexc.com/api/v1/contract/funding_rate/CHANGETOKEN_USDT", //symbol BTC_USDT
    derivativeFundingRateHistoryURL:
      "https://contract.mexc.com/api/v1/contract/funding_rate/history?symbol=CHANGETOKEN_USDT&page_num=1&page_size=50",
  },
  {
    name: "bybit",
    spotURL:
      "https://api.bybit.com/v5/market/recent-trade?category=spot&symbol=CHANGETOKENUSDT&limit=1", //symbol BTCUSDT
    derivativeURL:
      "https://api.bybit.com/v5/market/recent-trade?category=linear&symbol=CHANGETOKENUSDT&limit=1", //symbol BTCUSDT
    derivativeFundingRateURL:
      "https://api.bybit.com/v5/market/funding/history?category=linear&symbol=CHANGETOKENUSDT&limit=1", //symbol BTCUSDT
    derivativeFundingRateHistoryURL:
      "https://api.bybit.com/v5/market/funding/history?category=linear&symbol=CHANGETOKENUSDT&limit=50",
  },
  {
    name: "okx",
    spotURL:
      "https://www.okx.com/api/v5/market/ticker?instId=CHANGETOKEN-USDT-SWAP&instType=SPOT", //symbol BTC-USDT
    derivativeURL:
      "https://www.okx.com/api/v5/market/ticker?instId=CHANGETOKEN-USDT-SWAP&instType=FUTURES", //symbol BTC-USDT
    derivativeFundingRateURL:
      "https://www.okx.com/api/v5/public/funding-rate-history?instId=CHANGETOKEN-USDT-SWAP&limit=1", //symbol BTC-USDT
    derivativeFundingRateHistoryURL:
      "https://www.okx.com/api/v5/public/funding-rate-history?instId=CHANGETOKEN-USDT-SWAP&limit=50",
  },
  {
    name: "kucoin",
    spotURL:
      "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=CHANGETOKEN-USDT", //symbol BTC-USDT
    derivativeURL:
      "https://api-futures.kucoin.com/api/v1/ticker?symbol=CHANGETOKENUSDTM", //symbol BTC-USDT
    derivativeFundingRateURL:
      "https://api-futures.kucoin.com/api/v1/funding-rate/CHANGETOKENUSDTM/current", //symbol BTC-USDT
    derivativeFundingRateHistoryURL:
      "https://api-futures.kucoin.com/api/v1/contract/funding-rates?symbol=CHANGETOKENUSDTM&from=1700310700000&to=1702310700000",
  },
];
const coins = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "ADA",
  "XRP",
  "DOT",
  "DOGE",
  "LUNA",
  "AVAX",
  "LINK",
  "MATIC",
  "XLM",
  "SHIB",
  "VET",
  "FTT",
  "ALGO",
  "ATOM",
  "TRX",
  "EGLD",
  "SOL",
  "AAVE",
  "UNI",
  "FIL",
  "GRT",
  "EOS",
  "XTZ",
  "NEO",
  "THETA",
  "XMR",
  "MIOTA",
  "MKR",
  "COMP",
  "HBAR",
  "DCR",
  "WAVES",
  "ICP",
  "KSM",
  "SNX",
  "ENJ",
  "NANO",
  "TFUEL",
  "RUNE",
  "SUSHI",
  "QTUM",
  "BAT",
  "HNT",
  "DASH",
  "ETC",
  "FLOW",
  "ICX",
  "CAKE",
  "ZEC",
  "MANA",
  "STX",
  "ZIL",
  "CHZ",
  "CRV",
  "RSR",
  "ANKR",
  "GALA",
  "REN",
  "BNT",
  "ONT",
  "ONE",
  "FTM",
  "SAND",
  "LRC",
  "OMG",
  "XEM",
  "UMA",
  "KAVA",
  "CELO",
  "MIR",
  "RVN",
  "OCEAN",
  "ALICE",
  "YFI",
  "WAXP",
  "AR",
  "DGB",
  "STORJ",
  "BTG",
  "VGX",
  "GNO",
  "REV",
  "RLC",
  "HBTC",
  "CKB",
  "XVS",
];

const request = async (baseUrl) => {
  try {
    const result = await (await axios.get(baseUrl)).data;
    return result;
  } catch (e) {
    return [];
  }
};

async function fetchBulkArray(
  exchanges = ["kucoin"], // made kucoin the default. So the system will not be overwhelmed
  duration = 14
) {
  const derivativeFundingRateHistoryBaseURLs = [];

  exchanges.map((exchange) => {
    const exchangefound = exchangeObject.find((foundObject) =>
      foundObject.name.toLowerCase().includes(exchange)
    );
    derivativeFundingRateHistoryBaseURLs.push(
      exchangefound.derivativeFundingRateHistoryURL
    );
  });

  const derivativeFundingRateHistoryURLs = [];

  // now loop through coins, then loop through urls to add the spot urls
  coins.map((coin) => {

    derivativeFundingRateHistoryBaseURLs.map((baseUrl) => {
      let match = baseUrl.match(/CHANGETOKEN/i);

      let newSymbol;

      if (match[0] === match[0].toUpperCase()) {
        newSymbol = coin.toUpperCase();
      } else {
        newSymbol = coin.toLowerCase();
      }

      let newUrl = baseUrl.replace(/CHANGETOKEN/i, newSymbol);

      //if url is kucoin, we set the correct from and to values
      if (baseUrl.includes("kucoin")) {
        const nowTimestamp = moment().valueOf();
        const last14DaysTimestamp = moment().subtract(parseInt(duration), "days").valueOf();

        newUrl = newUrl
          .replace(/from=\d+/g, `from=${last14DaysTimestamp}`)
          .replace(/to=\d+/g, `to=${nowTimestamp}`);
      }

      derivativeFundingRateHistoryURLs.push(newUrl);
    });
  });



  const fetchDerivativeFetchRateHistoryDetails = await Promise.all(
    derivativeFundingRateHistoryURLs.map(async (url) => {
      const response = await request(url);
      return { url, response };
    })
  );

  const finalDerivativeFundingRateHistory = [];

  fetchDerivativeFetchRateHistoryDetails.map((response) => {
    if (response.url.includes("okx")) {
      const regex = /instId=([^&]+)/;

      const match = response.url.match(regex);
      const symmbol = match[1].replace("-SWAP", "");

      const fourteenDaysAgo = moment().subtract(parseInt(duration), "days");

      const filteredData = response?.response?.data?.filter((entry) => {
        const fundingTime = moment(parseInt(entry.fundingTime));
        return fundingTime.isSameOrAfter(fourteenDaysAgo);
      });

      const groupedData = {};
      filteredData?.forEach((entry) => {
        const fundingDate = moment(parseInt(entry.fundingTime)).format("DD/MM");
        if (
          !(fundingDate in groupedData) ||
          moment(groupedData[fundingDate].fundingTime).isBefore(
            moment(entry.fundingTime)
          )
        ) {
          groupedData[fundingDate] = entry;
        }
      });

      const output = Object.values(groupedData).map((entry) => ({
        fundingRate: (parseFloat(entry.fundingRate) * 100 * 365).toFixed(3),
        fundingDate: moment(parseInt(entry.fundingTime)).format("DD/MM"),
      }));
      // process the response and
      finalDerivativeFundingRateHistory.push({
        name: "OKX",
        pair: symmbol.toUpperCase(),
        history: output,
      });
    } else if (response.url.includes("mexc")) {
      const regex = /symbol=([^&]+)/;

      const match = response.url.match(regex);
      const symbol = match[1].replace(/_/g, "-");

      const resultList = response?.response?.data?.resultList;

      const today = moment().startOf("day");
      const last14Days = moment().subtract(parseInt(duration), "days").startOf("day");

      const filteredData = resultList?.filter((item) => {
        const fundingDate = moment(item.settleTime);
        return fundingDate.isBetween(last14Days, today, "day", "[]");
      });

      const groupedData = {};
      filteredData?.forEach((item) => {
        const fundingDate = moment(item.settleTime).format("DD/MM");
        if (
          !(fundingDate in groupedData) ||
          moment(item.settleTime).isAfter(groupedData[fundingDate].settleTime)
        ) {
          groupedData[fundingDate] = item;
        }
      });
      const output = Object.values(groupedData).map((entry) => ({
        fundingRate: (parseFloat(entry.fundingRate) * 100 * 365).toFixed(3),
        fundingDate: moment(entry.settleTime).format("DD/MM"),
      }));

      finalDerivativeFundingRateHistory.push({
        name: "MEXC",
        pair: symbol.toUpperCase(),
        history: output,
      });
    } else if (response.url.includes("hbdm")) {
      const regex = /contract_code=([^&]+)/;

      const match = response.url.match(regex);

      // Extracting funding rates for the last 14 days
      const fourteenDaysAgo = moment().subtract(parseInt(duration), "days");
      const filteredData = response?.response?.data?.data?.filter((entry) =>
        moment(parseInt(entry.funding_time)).isAfter(fourteenDaysAgo)
      );

      // Grouping funding rates by date and selecting the most recent one
      const output = [];
      const fundingRatesByDate = {};
      filteredData?.forEach((entry) => {
        const date = moment(parseInt(entry.funding_time)).format("DD/MM");
        const rate = entry.funding_rate;
        if (
          !(date in fundingRatesByDate) ||
          moment(parseInt(entry.funding_time)).isAfter(
            moment(parseInt(fundingRatesByDate[date].funding_time))
          )
        ) {
          fundingRatesByDate[date] = {
            fundingRate: (parseFloat(rate) * 100 * 365).toFixed(3),
            fundingDate: date,
          };
        }
      });

      for (const date in fundingRatesByDate) {
        output.push(fundingRatesByDate[date]);
      }

      finalDerivativeFundingRateHistory.push({
        name: "HUOBI",
        pair: match[1].toUpperCase(),
        history: output,
      });
    } else if (response.url.includes("bybit")) {
      const regex = /symbol=([^&]+)/;

      // Match the symbol value using the regex
      const match = response.url.match(regex);
      const symbol = match[1].replace(/(USDT|usdt)/, "-$1");

      const list = response?.response?.result?.list;
      const today = moment();

      // Get the date 14 days ago
      const fourteenDaysAgo = moment().subtract(parseInt(duration), "days");

      // Filter funding rates within the last 14 days
      const filteredData = list?.filter((item) =>
        moment(parseInt(item.fundingRateTimestamp)).isBetween(
          fourteenDaysAgo,
          today
        )
      );

      // Group the funding rates by date and choose the most recent time for each date
      const groupedByDate = {};
      filteredData?.forEach((item) => {
        const date = moment(parseInt(item.fundingRateTimestamp));
        const formattedDate = date.format("DD/MM");
        if (
          !groupedByDate[formattedDate] ||
          moment(groupedByDate[formattedDate].fundingRateTimestamp).isBefore(
            date
          )
        ) {
          groupedByDate[formattedDate] = {
            fundingRate: (parseFloat(item.fundingRate) * 100 * 365).toFixed(3),
            fundingDate: formattedDate,
          };
        }
      });

      // Convert the grouped data to an array
      const output = Object.values(groupedByDate);
      finalDerivativeFundingRateHistory.push({
        name: "BYBIT",
        pair: symbol.toUpperCase(),
        history: output,
      });
    } else if (response.url.includes("kucoin")) {
      const regex = /symbol=([^&]+)/;
      const match = response.url.match(regex);
      const symbol = match[1].replace(/(USDT)M/, "-$1");

      function formatTimestamp(timestamp) {
        return moment(timestamp).format("DD/MM");
      }

      // Filter data for the last 14 days
      const currentDate = moment();
      const fourteenDaysAgo = moment().subtract(parseInt(duration), "days");

      const filteredData = response?.response?.data?.filter((entry) => {
        const entryDate = moment(entry.timepoint);
        return entryDate.isBetween(fourteenDaysAgo, currentDate, null, "[]");
      });

      // Group data by funding date and find the most recent entry for each date
      const groupedData = {};
      filteredData?.forEach((entry) => {
        const dateKey = formatTimestamp(entry.timepoint);
        if (
          !(dateKey in groupedData) ||
          groupedData[dateKey].timepoint < entry.timepoint
        ) {
          groupedData[dateKey] = entry;
        }
      });

      // Prepare output in desired format
      const output = Object.values(groupedData).map((entry) => ({
        fundingRate: (parseFloat(entry.fundingRate) * 100 * 365).toFixed(3),
        fundingDate: formatTimestamp(entry.timepoint),
      }));
      finalDerivativeFundingRateHistory.push({
        name: "KUCOIN",
        pair: symbol.toUpperCase(),
        history: output,
      });
    }
  });

  // const combinedData = finalSpot.map((spot) => {
  //   const historyItem = finalDerivativeFundingRateHistory.find(
  //     (item) => item.pair === spot.pair && item.name == spot.name
  //   );
  //   return {
  //     name: spot.name,
  //     pair: spot.pair,
  //     price: spot.price,
  //     history: historyItem ? historyItem.history : [],
  //   };
  // });

  return finalDerivativeFundingRateHistory;
}

module.exports = fetchBulkArray;
