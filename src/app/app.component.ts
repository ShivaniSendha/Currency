import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import axios from 'axios';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { CurrencyConverterComponent } from './currency-converter/currency-converter.component';


interface DataPoint {
  x: Date;
  y: number;
  label: string;
}


interface ChartOptions {
  zoomEnabled: boolean;
  exportEnabled: boolean;
  theme: string;
  title: {
    text: string;
  };
  axisX: {
    title: string;
    valueFormatString: string;
  };
  axisY: {
    title: string;
    includeZero: boolean;
  };
  data: {
    type: string;
    dataPoints: DataPoint[];
  }[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CanvasJSAngularChartsModule, CurrencyConverterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular17ssrapp';
  historicalData: { date: string; rate: number }[] = [];
  currencies: string[] = [];
  baseCurrency: string = 'INR';
  targetCurrency: string = 'USD';

  lastUpdated: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  chartOptions: ChartOptions = {
    zoomEnabled: true,
    exportEnabled: true,
    theme: "light2",
    title: {
      text: "Historical Exchange Rates"
    },
    axisX: {
      title: "Date",
      valueFormatString: "YYYY-MM-DD",
    },
    axisY: {
      title: "Exchange Rate",
      includeZero: false,
    },
    data: [{
      type: "line",
      dataPoints: [] // Start with an empty array
    }]
  };


  async fetchHistoricalData() {
    try {
        const today = new Date();
        const promises = [];
    
        // Fetch historical data for the last 14 days
        for (let i = 1; i <= 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const formattedDate = this.formatDate(date);
            promises.push(this.fetchExchangeRateStatistics(formattedDate));
        }
    
        const results = await Promise.all(promises);
        this.historicalData = results.reverse();
        this.updateChart();  // Ensure this method is called after fetching data
    } catch (error) {
        console.error('Error fetching historical data', error);
    }
}


  ngOnInit() {
    // Optionally call this method if needed
    this.fetchCurrencies();
    this.fetchExchangeRateStatistics(this.formatDate(new Date()))
  }
  onCurrencyChanged(event: { base: string; target: string; amount: number }) {
    this.baseCurrency = event.base;
    this.targetCurrency = event.target;
    const amount = event.amount; // Get the amount

    console.log('Fetching historical data for', this.baseCurrency, 'to', this.targetCurrency);

    this.fetchHistoricalData();
    this.fetchExchangeRateStatistics(this.formatDate(new Date())) // If needed to fetch data based on this event
  }


  async fetchCurrencies() {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${this.baseCurrency}`);
      this.currencies = Object.keys(response.data.rates);
     
      
      this.lastUpdated = response.data.date;
    } catch (error) {
      console.error('Error fetching currencies', error);
      this.errorMessage = 'Failed to load currencies';
    }
  }

  async fetchExchangeRateStatistics(date: string) {
    try {
      const response = await axios.get(`https://api.fastforex.io/historical?date=${date}&from=${this.baseCurrency}&to=${this.targetCurrency}&api_key=13910129e8-424ce2f0e5-skgv5z`);
      console.log('hjhjhjhj',this.currencies);
      console.log(`base Response for ${this.baseCurrency} to ${this.targetCurrency}:`, response.data);
      const rate = response.data.results[this.targetCurrency];

      if (rate === undefined || rate === null) {
        throw new Error('Rate not found');
      }

      return { date, rate };

    } catch (error) {
      console.error('Error fetching exchange rate statistics', error);

      return { date, rate: null };
    }
  }



  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  updateChart() {
    this.chartOptions.data[0].dataPoints = this.historicalData.map(item => ({
        x: new Date(item.date),
        y: item.rate,
        label: `${item.date}: ${item.rate}`
    }));
    
    // If your chart library requires it, you may need to refresh or redraw the chart here
}



  chartEvent(event: any) {
    console.log(event);
  }
}
