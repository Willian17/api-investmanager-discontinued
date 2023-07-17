export interface ListTickersResponseDto {
  results: [
    {
      symbol: string;
      shortName: string;
      currency: string;
      regularMarketPrice: number;
      regularMarketDayHigh: number;
      regularMarketDayLow: number;
      regularMarketDayRange: string;
      regularMarketChange: number;
      regularMarketChangePercent: number;
      regularMarketVolume: number;
      regularMarketPreviousClose: number;
      regularMarketOpen: number;
      fiftyTwoWeekLowChange: number;
      fiftyTwoWeekLowChangePercent: number;
      fiftyTwoWeekRange: string;
      fiftyTwoWeekHighChange: number;
      fiftyTwoWeekHighChangePercent: number;
      fiftyTwoWeekLow: number;
      fiftyTwoWeekHigh: number;
      validRanges: string[];
      historicalDataPrice: any[];
      priceEarnings: number;
      earningsPerShare: number;
      logoUrl: string;
      dividendsData: any[];
    },
  ];
}
