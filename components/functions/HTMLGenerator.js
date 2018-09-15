// "We can write a function that creates components
// "


import firebase, {sortedPagesSnapshot} from '../../firebase';

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
              checkVoid(tag_name){

                let tagName = this.tag_name || tag_name;
                let voidFlag = false;

                //Checks to see if the element is one of the W3 spec's void elements.
                //https://www.w3.org/TR/html5/syntax.html#void-elements

                const Voidlist = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
                  
                  Voidlist.forEach((voidTag) => {
                    if(voidTag === tagName) voidFlag = true;
                  });

                return voidFlag; 
              }

              /*=================
              When called on a sorted /tags/ snapshot, will "index" the HTML ()
              and add them recursively as JSX react elements
              =================*/


              /*=======================
              In JSX:
              
              let container = (<TagName>{child}</TagName>)

              <Foo><Bar> </Bar></Foo>

              It's nested arrays!

              This function will index values in firebase Pages and return the JSX to display them. 

              ========================*/

              indexAndDisplayHTML(placementArray, tagsSnapshot){
                let sortedPagesSnapshot = sortedPagesSnapshot();

                let TagPlacement = this.tag_placement;
                let TagName = this.tag_type;
                let tagArray = new TagArray();

/* 
  How this will work: 
    From another function (assbm, assemble a list of 



                  This is "prior"                              */  
                //     *         * This is our placement
                //ex: [1, 1.1, 1.2, 1.2.3 1.3, 1.4, 1.5 2]
                //              *  -> If next is not next_prior, include as a nest

                // Anatomy of an HTML Index:
                //    1.2.5
                //    ^ | |
// Look for the value in this place 


//!!! NO worries, firebase can sort this! 

                  //Compare the next to this

                  var tagSnapJSON = JSON.stringify(tagsSnapshot);

                  let indexArray = [];

                  let JSXArray = [];

                  for( keyval in tagSnapJSON){

                      let keyname = tagSnapJSON.key;
                      let raw_placement = tagSnapJSON.placement;
                      let string_placement;

                      if(typeof raw_placement === "number"){
                        let string_placement = raw_placement.toString();
                      }

                      let pre_parsed_placement = string_placement ? string_placement : raw_placement;

                      let parsed_placement = pre_parsed_placement.split('.');                    

                      indexArray.push(parsed_placement);
                  }

                    /*================
                    Compare the values and use logic
                    ================*/

                    function compareDigit(array1, array2){

                    }

                    /*
                      Previously, we had: 
                      a list of indices in an array
                      [1.0, 1.1, 1.1.2, 1.2] etc.
 
                    */

                    for(let i = 0; i < indexArray.length; i++){

                      let currentIndex = indexArray[i];
                      let nextIndex = indexArray[i+1];

                      if(currentIndex == nextIndex){
                        /* Throw error and rectify accordingly in the future */
                      }
                      else if(){
                        /* Throw error that the array isn't sorted properly and fix */
                      }
                      else if(currentIndex < nextIndex){

                        for(let j = 0; j < ((indexArray[i].length > indexArray[i+1].length) ? indexArray[i].length : indexArray[i+1].length); j++){
                          if(currentIndex[j] == nextIndex[j]){
                            //This digit is the same.  Do nothing and iterate.
                          }else if(!currentIndex[j] && nextIndex[j]){
                            // ex: [ ... ,1.2 ,1.2.1 , ...]
                            //The next index contains a next-level nested element.  Return the next as one. 
                            let nested_element = nextIndex[j];

                            //convert indexArray back into a string to re-reference it relative to Firebase
                              //recall that indexArray will be in the form of '1.1.2.3'
                            let placement_re_ref = (indexArray) =>{
                              let return_placement = [];
                              for(let k = 0; k < nested_element.length; k++){
                                if(k != nested_element.length-1){
                                  return_placement.push(nested_element[k]+".");
                                }
                                else if (k == nested_element.length-1){
                                  return_placement.push(nested_element[k]);
                                }
                              }
                              return return_placement;
                            }

                            /////////////////////////////////////////////
                            let corresponding_jsx = (placement_re_ref) =>{

                            }

                            /////////////////////////////////////////////

                            
                            
                          }

                          let comparatorArray
                        }
                        //need to check by which digit
                      }
                      function checkNext(){
                        if(indexArray[]){

                        }else if(){

                        }                        
                      }



                    }


                    /*==================
                    We should have arrays within arrays of 

                    Go through and for each pushed nested_element create a new React class 
                    ==================*/


            //  !!!! This isn't forEach in the snapshot!  It HAS to be that!

                let returnArray = [];

                for(let i = 0; i < placementArray.length; i++){

                  var variationString = string()
                  var prior = Math.floor(TagPlacement);
                  var next_prior = prior + 1;
                  var next = 

                  if (prior === TagPlacement){
                    let basePlace = prior;
                    //Then, don't check for any prior tags
                  }

                  let foo = React.createElement({

                });





                }
               
            
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

