/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {

    //Making interface to store data of asingle row for swift opeation
    interface Row{
        Title:string,
        KeyPages:string,
        Channels:string,
        MarketPlace:string,
        Visits:number 
    }

    //Creating a definite row array that stores the whole data making it a table
    interface ViewModel{
        Row:Row[] //a ViewModel that stores row type arrays
    }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private Container: d3.Selection<SVGElement>;

        //Defining a object to store data
        private DataStore:ViewModel;

        constructor(options: VisualConstructorOptions) {
            this.target = options.element;           
        }

        //Data inserting code
        private getViewModel(options: VisualUpdateOptions): ViewModel {
            //Fetching data
            let dv = options.dataViews;
           
            //Defining the Data Store
            let TempDataStore:ViewModel={
                Row:[]
            }

            //Default Void Check
            if (!dv
                || !dv[0]
                || !dv[0].categorical
                || !dv[0].categorical.categories
                || !dv[0].categorical.categories[0].source
                || !dv[0].categorical.values
                || !dv[0].metadata)
                return TempDataStore;

            //Assigning Quick references
            let Title = dv[0].categorical.categories[0].values;
            let KeyPages = dv[0].categorical.categories[1].values;
            let Channels = dv[0].categorical.categories[2].values;
            let MarketPlace = dv[0].categorical.categories[3].values;
            let Visits = dv[0].categorical.values[0].values;
            
            //Pushing data into Viewmodel
            for(let i=0;i<Visits.length;i++){
                TempDataStore.Row.push({
                    Title:<string>Title[i],
                    KeyPages:<string>KeyPages[i],
                    Channels:<string>Channels[i],
                    MarketPlace:<string>MarketPlace[i],
                    Visits:<number>Visits[i]
                })
            }

            return TempDataStore;
        }
        
        //Function to create a Panel
        public createPanel(head:string,parentId:string,metric:number){
            
            let Panel=d3.select("#"+parentId).append("div").classed('panel',true);
            
            let circle=Panel.append("svg").attr({height:'40px',width:'40px'}).append("circle");
            circle.attr({
                cx:'20',
                cy:'20',
                r:'10',
                fill:'none',
                'stroke-width':'2',
                stroke:'black'
            });
            Panel.append('span').classed('head',true).text(head);
            Panel.append('div').classed('metric',true).text(metric);
        }
        public update(options: VisualUpdateOptions) {

            //Removing all DOM Elements
            d3.select(this.target).selectAll("div").remove();

             //Defining the html container
             this.Container=d3.select(this.target).append("div").classed("container-fluid",true);
             //Initializing the rows
             let row=this.Container.append("div").classed("row",true).attr({'id':'row1'});
             //Appending the respective data and link divisions
             row.append("div").classed("col-2 data",true).attr({id:'Title'}).append("div").classed("title",true).text(".").style({color:'white'}); //This piece of code basic ally creates a empty head
             row.append("div").classed("col-1 lines",true);
             row.append("div").classed("col-2 data",true).attr({id:'KeyPages'}).append("div").classed("title",true).text("Key Pages");
             row.append("div").classed("col-1 lines",true);
             row.append("div").classed("col-2 data",true).attr({id:'Channels'}).append("div").classed("title",true).text("Channels");
             row.append("div").classed("col-1 lines",true);
             row.append("div").classed("col-2 data",true).attr({id:'MarketPlace'}).append("div").classed("title",true).text("MarketPlace");

            //Making a viewmodel function along with daqta updation
            this.getViewModel(options);

            this.createPanel('hello','Title',50);
            this.createPanel('Hi','KeyPages',150);
            this.createPanel('Hmm','KeyPages',250);
            //Binding the data
            for(let i=0;i<this.DataStore.Row.length;i++){
                
                
                console.log(this.DataStore.Row[i].Title);
            }
            
        }

        // private static parseSettings(dataView: DataView): VisualSettings {
        //     return VisualSettings.parse(dataView) as VisualSettings;
        // }

        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        // public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        //     return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
        // }
    }
}