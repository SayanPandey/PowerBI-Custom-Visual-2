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

        public Colors:string[]=['#6BAFF2','#6697DD','#5578B7','#3A5C84','#1D3349','#000000']

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

        //Utility function to remove special characters / ID making function
        public removeSpl(x: string): string {
            x = x.replace(/[&\/\\#,+()$~%.'":*?<>{}\s]/g, '');
            return x;
        }
        //Utility function to get formatted value
        public getFormatted(Quantity:number):string{
            let value:string
            if(Quantity>=1000000000){
                value=(Quantity/1000000000).toFixed(1)+"B";
                return value;
            }
           
            else if(Quantity>=1000000){
                value=(Quantity/1000000).toFixed(1)+"M";
                return value;
            }
            else  if(Quantity>=1000){
                value=(Quantity/1000).toFixed(1)+"K";
                return value;
            }
            else
                return ""+Quantity;
        }

        //Utility function to create line
        public createLine(id1:string,id2:string,thickness:number,color:string){

            //Coordinates for first deivision
            var Div1=$("#"+id1);
            var x1=Div1.offset().left+(Div1.width());
            var y1=Div1.find('svg').offset().top;

            //Coordinates for first deivision
            var Div2=$("#"+id2);
            var x2=Div2.offset().left;
            var y2=Div2.find('svg').offset().top;

            //Thecontrol points
            var C1x=x1+(Div1.width()/2);
            console.log(thickness);
            d3.select('#row1').append('svg').classed('connecting',true)
            .html('<path d="M'+x1+','+y1+' C'+C1x+','+y1+' '+C1x+','+y2+' '+x2+','+y2+'"/>')
            .style({
                'stroke-width':thickness,
                'stroke':color
            });

            //finding circle and colouring it
            Div2.find('circle').attr({
                'stroke':color
            })
        }

        //Utility function to create Deafault load
        public getDefaultLoadData(){

            //Filtering and adding default load
            for(let i=0;i<this.DataStore.Row.length;i++){

                //Finding default value for first column
                if(this.DataStore.Row[i].KeyPages=='All' && this.DataStore.Row[i].Channels=='All' && this.DataStore.Row[i].MarketPlace=='All'){
                    if(!document.getElementById(this.removeSpl(this.DataStore.Row[i].Title))){
                        this.createPanel(this.DataStore.Row[i].Title,'data1',this.DataStore.Row[i].Visits);
                        this.DataStore.Row.splice(i,1);
                        i=i-1;
                    }
                }
                else if(this.DataStore.Row[i].KeyPages != 'All' && this.DataStore.Row[i].Channels=='All' && this.DataStore.Row[i].MarketPlace=='All'){
                    if(!document.getElementById(this.removeSpl(this.DataStore.Row[i].KeyPages))){
                        this.createPanel(this.DataStore.Row[i].KeyPages,'data2',this.DataStore.Row[i].Visits);
                        this.DataStore.Row.splice(i,1);
                        i=i-1;
                    }
                }
                else if(this.DataStore.Row[i].KeyPages == 'All' && this.DataStore.Row[i].Channels!='All' && this.DataStore.Row[i].MarketPlace=='All'){
                    if(!document.getElementById(this.removeSpl(this.DataStore.Row[i].Channels))){
                        this.createPanel(this.DataStore.Row[i].Channels,'data3',this.DataStore.Row[i].Visits);
                        this.DataStore.Row.splice(i,1);
                        i=i-1;
                    }
                }
                else if(this.DataStore.Row[i].KeyPages == 'All' && this.DataStore.Row[i].Channels=='All' && this.DataStore.Row[i].MarketPlace!='All'){
                    if(!document.getElementById(this.removeSpl(this.DataStore.Row[i].MarketPlace))){    
                        this.createPanel(this.DataStore.Row[i].MarketPlace,'data4',this.DataStore.Row[i].Visits);
                        this.DataStore.Row.splice(i,1);
                        i=i-1;
                    }
                }
            }
        }
        
        //Function to create a Panel
        public createPanel(head:string,parentId:string,metric:number){
            
            let Panel=d3.select("#"+parentId).append("div").classed('panel',true).attr({
                id:this.removeSpl(head)
            });
            
            let circle=Panel.append("svg").attr({height:'40px',width:'40px'}).append("circle");
            circle.attr({
                cx:'20',
                cy:'20',
                r:'10',
                fill:'none',
                'stroke-width':'2',
                stroke:'black',
            });
            Panel.append('div').classed('head',true).text(head);
            Panel.append('div').classed('metric',true).text(this.getFormatted(metric));
            Panel.append('input').attr({
                type:'hidden',
                val:metric
            });
        }

        //Utility function to create lines
        public getLines(presentId:string,nowClicked:number){
            //Getting all the panel in next data column
            let Panels=$('#data'+(nowClicked+1)).find('.panel').find('input');
            
            //Initializing sum
            let sum:number=0;

            //Creating lines
            for(let i=0;i<Panels.length;i++){
                sum+=parseInt($(Panels[i]).attr('val'));
            }
            //Making the multiplier
            let multiplier: number=30/sum;
            //function to create lines

            for(let i=0;i<Panels.length;i++){
                let id_to_connect=Panels.eq(i).parent().attr('id');
                this.createLine(presentId,id_to_connect,parseInt($(Panels[i]).attr('val'))*multiplier,this.Colors[i]);
            }
            
        }

        //Update function
        public update(options: VisualUpdateOptions) {

            //Removing all DOM Elements
            d3.select(this.target).selectAll("div").remove();

             //Defining the html container
             this.Container=d3.select(this.target).append("div").classed("container-fluid",true);
             //Initializing the rows
             let row=this.Container.append("div").classed("row",true).attr({'id':'row1'});
             //Appending the respective data and link divisions
             row.append("div").classed("col-2 data",true).attr({id:'data1'}).append("div").classed("title",true).text(".").style({color:'white'}); //This piece of code basic ally creates a empty head
             row.append("div").classed("col-1 lines",true);
             row.append("div").classed("col-2 data",true).attr({id:'data2'}).append("div").classed("title",true).text("Key Pages");
             row.append("div").classed("col-1 lines",true);
             row.append("div").classed("col-2 data",true).attr({id:'data3'}).append("div").classed("title",true).text("Channels");
             row.append("div").classed("col-1 lines",true);
             row.append("div").classed("col-2 data",true).attr({id:'data4'}).append("div").classed("title",true).text("MarketPlace");

            //Making a viewmodel function along with daqta updation
            this.DataStore=this.getViewModel(options);

            //Finding and clearing default load VALUES
            this.getDefaultLoadData();

            //Function to get lines;
            this.getLines("TotalMPNVisits",1);
            this.getLines("partnermicrosoftcomapplication-buildermarket-and-sell",2);
            this.getLines("campaign",3);
            
            
            //Viewport scrolling 
            var innerHeight = window.innerHeight;
            var rowHeight = $("#row1").height();
            if (rowHeight > innerHeight)    
                $(this.target).css({ "overflow-y": "scroll" });
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