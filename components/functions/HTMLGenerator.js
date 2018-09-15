// "We can write a function that creates components
// "

export class HTMLTag{
        constructor(tag_type, tag_content, tag_placement, tag_attributes){
          
          this.tag_type = tag_type;   //"img", "p", etc. 
          this.tag_content = tag_content;    //The "innerHTML" of the variable (i.e.- inner Text)
          this.tag_placement = tag_placement; //Used to determine page placement 
          this.tag_attribues = tag_attribues;   //styling, src, etc. 


          this.checkVoid = this.checkVoid.bind(this);
          this.generateDescriptor = this.generateDescriptor.bind(this);
          this.generateHTMLTag = this.generateHTMLTag.bind(this);
        }
              


              /*==============
              Determine if the given tag is a "void tag", and thus will not require a closing brace
              ===============*/ 
              checkVoid(){

                let tagName = this.tag_name;
                let voidFlag = false;

                //Checks to see if the element is one of the W3 spec's void elements.
                //https://www.w3.org/TR/html5/syntax.html#void-elements

                const Voidlist = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
                  
                  Voidlist.forEach((voidTag) => {
                    if(voidTag === tagName) voidFlag = true;
                  });

                return voidFlag; 
              }

              checkChildren(placementArray){

                let TagPlacement = this.tag_placement;
                let tagArray = new TagArray();
                //order by value 
                let placementArray = getPlacementArray();


                tagsSnap.forEach(){

                }

/* 
  How this will work: 
    From another function (assbm, assemble a list of 



                  This is "prior"                              */  
                //     *         * This is our placement
                //ex: [1, 1.1, 1.2, 1.3, 1.4, 1.5 2]
                //              *  -> If next is 

                for(let i = 0; i < placementArray; i++){

                }
                var prior = Math.floor(TagPlacement);
                var next_prior = prior + 1;
                var next = 

                if (prior === TagPlacement){
                  let basePlace = prior;
                  //Then, don't check for any prior tags
                }

                let foo = React.createElement({

                });
            
                //Get an ordered list of all children 




                //If the prior tag starts with the same integer as 


                return 
              }

            generateHTMLTag(placementArray){
                let TagName = this.tag_type;
                let tagContent = this.tag_content;
                let tagAttributes = this.tag_attributes;

                let voidFlag = checkVoid(tagName);

                let placeCheck = checkChildren(placementArray);

                /*
                To accomodate children, 
                use the old syntax:

                React.createElement(ParentTag, props, ...childTags)
            so...
                React.createElement('div', )
                
                */

                const nonVoidJSX = (<TagName {...tagAttributes}>{tagContent}</TagName>);
                const VoidJSX = (<TagName {...tagAttributes} />)
                //condition ? value if true : value if false
                return voidFlag ?  VoidJSX : nonVoidJSX; 
              }
          
          }

