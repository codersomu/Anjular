import { Component, OnInit, ViewChild } from '@angular/core';
import { IntradayHoldingsService } from '@services/intraday.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import { UtilService } from '@/_service/util.service';
import { MatAccordion } from '@angular/material/expansion';
import { environment } from '@env/environment';
import { next } from 'node_modules_1/sonic-forest/lib/util';
import { HoldingsService } from '@services/holdings.service';
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.sass'],
})
export class ListingComponent implements OnInit {
  displayedColumns: string[] = [
    'script',
    'current_price',
    'ptsC',
    'per',
    'RSI',

    'mg',
    'macdhist',
    'points',
    'volumegrowth',
    'EMA',
    //"reasons",
  ];
  dataSource: any;
  fullData = [];
  filter = {
    name: '',
    trend_up: false,
    trend_low: false,
    onlyholding: false,

    rsi_min: 0,
    rsi_max: 0,

    mg_min: 0,
    mg_max: 0,

    price_min: 0,
    price_max: 0,

    lr_below_lower: false,
    lr_above_lower: false,
    lr_below_middle: false,
    lr_above_middle: false,
    lr_below_upper: false,
    lr_above_upper: false,

    below_50_sma: false,
    above_50_sma: false,
    below_200_sma: false,
    above_200_sma: false,

    CDLHARAMI: false,
    y_CDLHARAMI: false,

    CDLPIERCING: false,
    y_CDLPIERCING: false,

    CDLDARKCLOUDCOVER: false,
    y_CDLDARKCLOUDCOVER: false,

    CDLENGULFING: false,
    y_CDLENGULFING: false,

    CDLEVENINGSTAR: false,
    y_CDLEVENINGSTAR: false,

    CDLHAMMER: false,
    y_CDLHAMMER: false,

    CDLHANGINGMAN: false,
    y_CDLHANGINGMAN: false,

    CDLMARUBOZU: false,
    y_CDLMARUBOZU: false,

    CDLSHOOTINGSTAR: false,
    y_CDLSHOOTINGSTAR: false,

    listingtype_table: true,
    listingtype_chart: false,
    macd_low: false,
    macd_up: false,

    macd_buy_cut: false,
    macd_sell_cut: false,

    sup_up: false,
    sup_down: false,
    sup_ydown_tup: false,
    sup_yup_tdown: false,

    ha_t_up: false,
    ha_y_up: false,
    ha_yy_up: false,

    ha_t_down: false,
    ha_y_down: false,
    ha_yy_down: false,

    price_t_up: false,
    price_y_up: false,
    price_yy_up: false,

    price_t_down: false,
    price_y_down: false,
    price_yy_down: false,
  };
  env = environment.IMAGE_URL;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  myStocks: any = [];
  constructor(
    public intraday: IntradayHoldingsService,
    public util: UtilService,
    private holdingServ: HoldingsService
  ) {
    // console.log(this.util.getPercent(400, 445));
  }
  openDialog(stockName): void {
    this.util.openDilagBox(stockName);
  }
  ngOnInit(): void {
    this.intraday
      .getIntradayDetails()
      .pipe(first())
      .subscribe({
        next: (data) => {
          let r: any = this.filterResult(data);
          this.fullData = [...r];
          this.dataSource = new MatTableDataSource(r);
          this.dataSource.sort = this.sort;
        },
        error: (error) => console.error('Data for'),
      });

    this.holdingServ.getHoldingStocks().subscribe((data: any) => {
      const stocks = data.map((item) => {
        return item.symbol;
      });
      this.myStocks = [...new Set(stocks)];
      // this.myStocks = data;
    });
  }

  filterResult(input) {
    let result = [];
    //let inFO = this.sectorService.getFOStock();
    console.log('result', input);
    input.map((data) => {
      // console.log('inFO',inFO);
      // console.log(data.symbol,inFO.indexOf(data.symbol));

      //data.per = parseFloat(data.per);
      //data.trdVolM = parseFloat(data.trdVolM);
      //data.ptsC = parseFloat(data.ptsC.replace(",", ""));
      //data.ltP = parseFloat(data.ltP.replace(",", ""));
      data.RSI = parseFloat(data.technical.RSI).toFixed(2);

      data.macdhist = parseFloat(data.technical.macdhist).toFixed(2);
      // data.macdhist = this.util.getPercent(
      //   data.y_technical.histogram,
      //   data.technical.histogram
      // );

      data.mg = parseFloat(
        this.util.getPercent(data.technical.monthmin, data.current_price)
      );

      data.macdhist = this.util.getPercent(
        data.technical.lr_lower,
        data.current_price
      );

      // data.macddiff = this.util.getPercent(
      //   data.technical.macd,
      //   data.technical.macdsignal
      // );
      //IRCTC

      /*  
      if(data.ltP < 400 && data.ltP > 4){
        result.push(data);
      }
      */

      /*
      if(inFO.indexOf(data.symbol) > 0){
         result.push(data);
       }
       */
      data.points = 0;
      data.reasons = {
        pros: [],
        cons: [],
      };

      if (data.RSI <= 40) {
        data.points += 1;
        data.reasons.pros.push('RSi is less than 40');
      }

      if (data.current_price <= data.technical.lr_middle) {
        data.points += 1;
        data.reasons.pros.push('Price is less than LR-middle');
      }

      data.volumegrowth = parseFloat(
        this.util.getPercent(data.technical.volumemonth, data.technical.Volume)
      );
    });

    // input = input.filter((item) => item.technical.sup_down != 0);
    // console.log('result', input);
    return input;
  }

  filterByTechnical() {
    this.filter.name = 'arv';

    let result = [...this.fullData];

    if (this.filter.onlyholding) {
      debugger;
      let tmp = [];
      result.map((item) => {
        if (this.myStocks.includes(item.script)) {
          tmp.push(item);
        }
        // return item;
      });
      result = tmp;
    }

    /**
     * HA
     */

    if (this.filter.ha_t_up) {
      result = result.filter(
        (item) => item.technical.ha_open < item.technical.ha_close
      );
    }

    if (this.filter.ha_y_up) {
      result = result.filter(
        (item) => item.y_technical.ha_open < item.y_technical.ha_close
      );
    }

    if (this.filter.ha_yy_up) {
      result = result.filter(
        (item) => item.yy_technical.ha_open < item.yy_technical.ha_close
      );
    }

    if (this.filter.ha_t_down) {
      result = result.filter(
        (item) => item.technical.ha_open > item.technical.ha_close
      );
    }

    if (this.filter.ha_y_down) {
      result = result.filter(
        (item) => item.y_technical.ha_open > item.y_technical.ha_close
      );
    }

    if (this.filter.ha_yy_down) {
      result = result.filter(
        (item) => item.yy_technical.ha_open > item.yy_technical.ha_close
      );
    }

    /**Price */

    if (this.filter.price_t_up) {
      result = result.filter(
        (item) => item.technical.Open < item.technical.Close
      );
    }

    if (this.filter.price_y_up) {
      result = result.filter(
        (item) => item.y_technical.Open < item.y_technical.Close
      );
    }

    if (this.filter.price_yy_up) {
      result = result.filter(
        (item) => item.yy_technical.Open < item.yy_technical.Close
      );
    }

    if (this.filter.price_t_down) {
      result = result.filter(
        (item) => item.technical.Open > item.technical.Close
      );
    }

    if (this.filter.price_y_down) {
      result = result.filter(
        (item) => item.y_technical.Open > item.y_technical.Close
      );
    }

    if (this.filter.price_yy_down) {
      result = result.filter(
        (item) => item.yy_technical.Open > item.yy_technical.Close
      );
    }

    if (this.filter.trend_up) {
      result = result.filter(
        (item) => item.technical.lr_middle > item.y_technical.lr_middle
      );
    }
    if (this.filter.trend_low) {
      result = result.filter(
        (item) => item.technical.lr_middle < item.y_technical.lr_middle
      );
    }

    if (this.filter.below_50_sma) {
      result = result.filter(
        (item) =>
          item.technical.SMA_50 && item.technical.SMA_50 >= item.current_price
      );
    }
    if (this.filter.above_50_sma) {
      result = result.filter(
        (item) =>
          item.technical.SMA_50 && item.technical.SMA_50 <= item.current_price
      );
    }

    if (this.filter.below_200_sma) {
      result = result.filter(
        (item) =>
          item.technical.SMA_200 && item.technical.SMA_200 >= item.current_price
      );
    }
    if (this.filter.above_200_sma) {
      result = result.filter(
        (item) =>
          item.technical.SMA_50 && item.technical.SMA_200 <= item.current_price
      );
    }

    if (this.filter.rsi_min) {
      result = result.filter((item) => item.RSI >= this.filter.rsi_min);
    }
    if (this.filter.rsi_max) {
      result = result.filter((item) => item.RSI <= this.filter.rsi_max);
    }

    if (this.filter.rsi_min) {
      result = result.filter((item) => item.RSI >= this.filter.rsi_min);
    }
    if (this.filter.rsi_max) {
      result = result.filter((item) => item.RSI <= this.filter.rsi_max);
    }

    if (this.filter.mg_min) {
      result = result.filter((item) => item.mg >= this.filter.mg_min);
    }
    if (this.filter.mg_max) {
      result = result.filter((item) => item.mg <= this.filter.mg_max);
    }

    if (this.filter.price_min) {
      result = result.filter(
        (item) => item.current_price >= this.filter.price_min
      );
    }
    if (this.filter.price_max) {
      result = result.filter(
        (item) => item.current_price <= this.filter.price_max
      );
    }

    if (this.filter.lr_below_lower) {
      result = result.filter(
        (item) => item.current_price < item.technical.lr_lower
      );
    }

    if (this.filter.lr_above_lower) {
      result = result.filter(
        (item) => item.current_price > item.technical.lr_lower
      );
    }

    if (this.filter.lr_below_middle) {
      result = result.filter(
        (item) => item.current_price < item.technical.lr_middle
      );
    }

    if (this.filter.lr_above_middle) {
      result = result.filter(
        (item) => item.current_price > item.technical.lr_middle
      );
    }

    if (this.filter.lr_below_upper) {
      result = result.filter(
        (item) => item.current_price < item.technical.lr_upper
      );
    }

    if (this.filter.lr_above_upper) {
      result = result.filter(
        (item) => item.current_price > item.technical.lr_upper
      );
    }

    if (this.filter.CDLHARAMI) {
      result = result.filter((item) => item.technical.CDLHARAMI == 100);
    }

    if (this.filter.y_CDLHARAMI) {
      result = result.filter((item) => item.y_technical.CDLHARAMI == 100);
    }

    if (this.filter.CDLPIERCING) {
      result = result.filter((item) => item.technical.CDLPIERCING == 100);
    }

    if (this.filter.y_CDLPIERCING) {
      result = result.filter((item) => item.y_technical.CDLPIERCING == 100);
    }

    if (this.filter.CDLDARKCLOUDCOVER) {
      result = result.filter((item) => item.technical.CDLDARKCLOUDCOVER == 100);
    }

    if (this.filter.y_CDLDARKCLOUDCOVER) {
      result = result.filter(
        (item) => item.y_technical.CDLDARKCLOUDCOVER == 100
      );
    }

    if (this.filter.CDLENGULFING) {
      result = result.filter((item) => item.technical.CDLENGULFING == 100);
    }

    if (this.filter.y_CDLENGULFING) {
      result = result.filter((item) => item.y_technical.CDLENGULFING == 100);
    }

    if (this.filter.CDLEVENINGSTAR) {
      result = result.filter((item) => item.technical.CDLEVENINGSTAR == 100);
    }

    if (this.filter.y_CDLEVENINGSTAR) {
      result = result.filter((item) => item.y_technical.CDLEVENINGSTAR == 100);
    }

    if (this.filter.CDLHAMMER) {
      result = result.filter((item) => item.technical.CDLHAMMER == 100);
    }

    if (this.filter.y_CDLHAMMER) {
      result = result.filter((item) => item.y_technical.CDLHAMMER == 100);
    }

    if (this.filter.CDLHANGINGMAN) {
      result = result.filter((item) => item.technical.CDLHANGINGMAN == 100);
    }

    if (this.filter.y_CDLHANGINGMAN) {
      result = result.filter((item) => item.y_technical.CDLHANGINGMAN == 100);
    }

    if (this.filter.CDLMARUBOZU) {
      result = result.filter((item) => item.technical.CDLMARUBOZU == 100);
    }

    if (this.filter.y_CDLMARUBOZU) {
      result = result.filter((item) => item.y_technical.CDLMARUBOZU == 100);
    }

    if (this.filter.CDLSHOOTINGSTAR) {
      result = result.filter((item) => item.technical.CDLSHOOTINGSTAR == 100);
    }

    if (this.filter.y_CDLSHOOTINGSTAR) {
      result = result.filter((item) => item.y_technical.CDLSHOOTINGSTAR == 100);
    }

    if (this.filter.macd_up) {
      // result = result.filter((item) => item.technical.histogram >= 0);
      // result = result.filter((item) => item.y_technical.histogram >= 0);
      // result = result.filter((item) => item.yy_technical.histogram >= 0);
      result = result.filter(
        (item) =>
          item.technical.histogram > item.y_technical.histogram &&
          item.y_technical.histogram > item.yy_technical.histogram
      );
      // result = result.filter((item) => item.y_technical.histogram >= 0);
      // result = result.filter((item) => item.yy_technical.histogram >= 0);
    }

    if (this.filter.macd_low) {
      // result = result.filter((item) => item.technical.histogram <= 0);
      // result = result.filter((item) => item.y_technical.histogram <= 0);
      // result = result.filter((item) => item.yy_technical.histogram <= 0);

      result = result.filter(
        (item) =>
          item.technical.histogram < item.y_technical.histogram &&
          item.y_technical.histogram < item.yy_technical.histogram
      );
    }

    if (this.filter.macd_buy_cut) {
      // result = result.filter(
      //   (item) =>
      //     item.y_technical.histogram < 0 &&
      //     item.technical.histogram > item.y_technical.histogram
      // );

      result = result.filter(
        (item) =>
          item.technical.MACD > item.technical.Signal_Line &&
          item.y_technical.MACD < item.y_technical.Signal_Line
      );
    }

    if (this.filter.sup_down) {
      result = result.filter((item) => item.technical.sup_down != 0);
    }

    if (this.filter.sup_up) {
      result = result.filter((item) => item.technical.sup_up != 0);
    }

    if (this.filter.sup_ydown_tup) {
      result = result.filter(
        (item) => item.y_technical.sup_down != 0 && item.technical.sup_up != 0
      );
    }

    if (this.filter.sup_yup_tdown) {
      result = result.filter(
        (item) => item.technical.sup_down != 0 && item.y_technical.sup_up != 0
      );
    }

    console.log(result);
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.sort = this.sort;
    //  &&
    //           item.y_technical.histogram < item.yy_technical.histogram
    //Signal_Line
    //MACD
    //histogram
    // macd line < singal line  =  natetive  trend

    // macd >0  : positive
    // macd < 0 : negetive

    // macd line pulls back to zero  :  buy
    console.log(this.dataSource);
  }
}
