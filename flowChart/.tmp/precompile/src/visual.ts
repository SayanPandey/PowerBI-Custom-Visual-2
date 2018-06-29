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
            x = x.replace(/[&\/\\#,+()$~%.'":=*?<>{}\s]/g, '');
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
        public createLine(id1:string,id2:string,thickness:number,color:string,nowClicked:number){
            
            //Fixing minimum thresold
            if(thickness<0.1)
                thickness=0.1;

            //Coordinates for first deivision
            var Div1=$("#"+id1);
            var x1=Div1.offset().left+(Div1.width());
            var y1=Div1.find('circle').offset().top+(Div1.find('circle').height()/2);

            //Coordinates for first deivision
            var Div2=$("#"+id2);
            var x2=Div2.offset().left;
            var y2=Div2.find('circle').offset().top+(Div2.find('circle').height()/2);

            //Thecontrol points
            var C1x=x1+(Div1.width()/2);
            let path=d3.select('#row1').append('svg').classed('connecting',true)
            .html('<path d="M'+x1+','+y1+' C'+C1x+','+y1+' '+C1x+','+y2+' '+x2+','+y2+'" />')
            .style({
                'stroke-width':thickness+'vmin',
                'stroke':color,
                "fill": "none"
            });
            path.classed('Lines'+nowClicked,true);

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
            
            let circle=Panel.append("svg").attr({height:'3vmax',width:'3vmax'}).append("circle");
            circle.attr({
                cx:'1.5vmax',
                cy:'1.5vmax',
                r:'1vmax',
                fill:'none',
                'stroke-width':'0.2vmax',
                stroke:'black',
            });
            Panel.append('div').classed('head',true).text(head);
            Panel.append('div').classed('metric',true).text(this.getFormatted(metric));
            Panel.append('input').attr({
                type:'hidden',
                value:metric
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
                sum+=parseInt($(Panels[i]).attr('value'));
            }
            //Making the multiplier
            let multiplier: number=6/sum;
            //function to create lines

            for(let i=0;i<Panels.length;i++){
                let id_to_connect=Panels.eq(i).parent().attr('id');
                this.createLine(presentId,id_to_connect,parseInt($(Panels[i]).attr('value'))*multiplier,this.Colors[i],nowClicked);
            }
            
        }

        //Utility function to set values 
        public setValue(id1:string,id2:string,metric:number,parentID:string){
            let ID:string;
            let setParent:string;
            switch(parentID){
                case 'data3':
                    if(id1!='All' && id2!='All'){
                        break;
                    }
                    else if(id1!='All' && id2=='All'){
                        ID=id1;
                        setParent='data3'
                    }
                    else if(id1=='All' && id2!='All'){
                        ID=id2;
                        setParent='data4'
                    }
                    this.createPanel(ID,setParent,metric);
                    break;

                case 'data4':
                    if(id2=='All'){
                        break;
                    }
                    else if(id2!='All'){
                        ID=id2;
                    }
                    this.createPanel(ID,parentID,metric);
                    break;
            }
            // this.createPanel(ID,parentID,metric);
            // $('#'+ID).find('.metric').text(this.getFormatted(metric));
            // $('#'+ID).find('input').val(metric);
        }

        //Utility function to animate lines
        public animateLines(className:string){
            $(className).each(function() {

                var sequence = $('path', this);
                var iter, vector, length;
            
                for (iter = 0; iter < sequence.length; iter++) {
                vector = sequence[iter];
                length = vector.getTotalLength();
                $(vector).attr('data-length', length).css({'stroke-dashoffset': length, 'stroke-dasharray': length});
                }
            });

            var sequence = $(className).find('path');
            for(let i=0;i<sequence.length;i++){
            var vector = sequence.eq(i);
            var length = parseInt(vector.attr('data-length'));

                vector.animate({'stroke-dashoffset': 0}, {
            
                    duration: 400,
                    easing: 'linear',
                });
            }

        }

        //Lines to create filter
        public filterData(Data:ViewModel,parentID:string): ViewModel{
            for(let i=0;i<Data.Row.length;i++){
                if(Data.Row[i].KeyPages!=parentID || Data.Row[i].Channels=='All' || Data.Row[i].MarketPlace=='All'){
                   Data.Row.splice(i,1);
                   i=i-1;
                }
            }
            return Data;
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
            this.getLines(this.removeSpl(this.DataStore.Row[0].Title),1);
            this.animateLines('.Lines1');

            //filtering functions and logics
            //Firstly making a temporary filter
            let TempDataStore:Row[];
            let TempDataStore2:Row[];
            TempDataStore=this.DataStore.Row.slice(0);
            //Storing the context
            let Context=this;

            //Restoring visual
            $('#data1').find('svg').click(function(){
                Context.update(options);
            })

            //First level filter
            $('#data2').find('svg').click(function(){

                //Replenishing the dataset
                TempDataStore=Context.DataStore.Row.slice(0);
                 
                console.log(TempDataStore);
                //Removing other lines
                $('.Lines2').remove();
                $('.Lines3').remove();

                //Removing the charts as well
                $('#data3').find('.panel').remove();
                $('#data4').find('.panel').remove();


                    let parentID=$(this).parent().attr('id').toString();
                    for(let i=0;i<TempDataStore.length;i++){
                        if(Context.removeSpl(TempDataStore[i].KeyPages)==parentID){
                            Context.setValue(Context.removeSpl(TempDataStore[i].Channels),Context.removeSpl(TempDataStore[i].MarketPlace),TempDataStore[i].Visits,'data3');
                        }
                        else{
                            TempDataStore.splice(i,1);
                            i=i-1;
                        }
                    }
                    TempDataStore2=TempDataStore;
                    TempDataStore=Context.DataStore.Row.slice(0);
                    //Making lines
                    Context.getLines(parentID,2);
                    Context.animateLines('.Lines2');
                    console.log(TempDataStore);

                    //Giving Click functionality to next level
                    $('#data3').find('svg').click(function(){

                        //Removing other lines
                        $('.Lines3').remove();
                        //Removing data as well
                        $('#data4').find('.panel').remove();
        
                            let parentID=$(this).parent().attr('id').toString();
                            console.log(parentID);
                            for(let i=0;i<TempDataStore2.length;i++){
                                if(Context.removeSpl(TempDataStore2[i].Channels)==parentID){
                                    Context.setValue(Context.removeSpl(TempDataStore2[i].Channels),Context.removeSpl(TempDataStore2[i].MarketPlace),TempDataStore2[i].Visits,'data4')
                                }
                            }
                            //Making lines
                            Context.getLines(parentID,3);
                            Context.animateLines('.Lines3');
                            console.log(TempDataStore2);
                    });
               //Replenishing dataset     
            });
        }
    }
}