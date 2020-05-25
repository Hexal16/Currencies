# Homework for Angular front-end developer position

There are 2 big parts of the page:
* List of all currencies
    * Get list of all currencies by given period(by default latest) and their rate against base currency(by default EUR)   
    * Imitating API behaviour - for example when loading data for a date that has no rates, closest date with rates is returned, can select future dates.
* Detailed info about single currency
    * Shows history of currency rates against base(by default EUR) currencies
    * When loading rates for several years, you might need to wait a few seconds
    * Imitating API behaviour - for example cannot select dates in future

Note : Forgot to test this on IE earlier and it does not work very well. Some more adjustments would be needed to run this app correctlly on IE
(Datepickeris faulty in IE)
    
## Running the Project Locally (Sorry, failed to set up docker)

1. Install npm `https://nodejs.org/en/`

2. Download code from  `https://github.com/Hexal16/Currencies`

3. Open powershell in root folder

4. Install the Angular CLI

    Run `npm install -g @angular/cli`

5. Install project dependencies

    Run `npm install` at the root of this project

6. Start project locally 
    
    Run `ng serve -o`