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

module powerbi.extensibility.visual.flowChart7F4C7E415B37487CA5DE1179720CDCB0  {

    //Making interface to store data for swift opeation
    interface ViewModel{
        Title:string,
        KeyPages:string,
        Channels:string,
        
    }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private settings: VisualSettings;
        private textNode: Text;
        private Container: d3.Selection<SVGElement>;

        constructor(options: VisualConstructorOptions) {
            this.target = options.element;

            //Defining the html container
            this.Container=d3.select(this.target).append("div").classed("container-fluid",true);
            //Initializing the rows
            let row=this.Container.append("div").classed("row",true).attr({'id':'row1'});
            //Appending the respective data and link divisions
            row.append("div").classed("col-2 data",true).append("div").classed("title",true).text(".").style({color:'white'}); //This piece of code basic ally creates a empty head
            row.append("div").classed("col-1 lines",true);
            row.append("div").classed("col-2 data",true).append("div").classed("title",true).text("Key Pages");
            row.append("div").classed("col-1 lines",true);
            row.append("div").classed("col-2 data",true).append("div").classed("title",true).text("Channels");
            row.append("div").classed("col-1 lines",true);
            row.append("div").classed("col-2 data",true).append("div").classed("title",true).text("MarketPlace");
           
        }
        //Data inserting code
        private getViewModel(options: VisualUpdateOptions): ViewModel {
            //Fetching data
            let dv = options.dataViews;
           
            let DefaultTiles: ViewModel = {
                Tiles: []
            };

            //Default Void Check
            if (!dv
                || !dv[0]
                || !dv[0].categorical
                || !dv[0].categorical.categories
                || !dv[0].categorical.categories[0].source
                || !dv[0].categorical.values
                || !dv[0].metadata)
                return DefaultTiles;

            //Assigning Quick references
            let Recruit = dv[0].categorical.categories[0].values;
            let Develop = dv[0].categorical.categories[1].values;
            let Launch = dv[0].categorical.categories[2].values;
            let Grow = dv[0].categorical.categories[3].values;
            let Direction=dv[0].categorical.categories[4].values;
            let Metric = dv[0].categorical.values[0].values;

            return DefaultTiles;
        }

        public update(options: VisualUpdateOptions) {

            //Making a viewmodel function along with daqta updation

            
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