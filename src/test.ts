// This file is required by karma.conf.js and loads recursively all the .spec and framework files
//https://www.google.com/search?&q=nse%3A+CDSL
// https://screener.in/company/CDSL/
// https://www.nseindia.com/get-quotes/equity?symbol=CDSL
//  https://in.tradingview.com/chart/gs6glM5Y/?symbol=NSE%3ACDSL
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
