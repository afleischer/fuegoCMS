//If inside closure, no need to pass variables in

GetHTML(){
	let setter = 0;
	let returnHTML = [];

	while (setter < placementArray.length){
		GetNestedHTML(){
	    	var AssociatedTagData = parentSnap[Object.keys(parentSnap)[setter]];
	    		var TagName = AssociatedTagData.tag_type;
				var TagPlacement = AssociatedTagData.placement;
				var TagContent = AssociatedTagData.content;
				var TagAttributes = AssociatedTagData.attributes;

			var first = placementArray[setter].toString.split('.');
			var next = placementArray[setter + 1].toString.split('.');

			if(!next){
				return React.createElement(TagName, TagAttributes);
			}

			let max = Math.max(first.length, next.length);

			/*================
			Begin digit comparison
			================*/

			for(let i = 0; i < max; i++){
				if(first[i] && next[i]) {
					//pass
				}

				if(!first[i] && !next[i]){
					let siblingHTML = React.createElement(TagName, TagAttributes);
					setter++;
					if( i === 0){
						returnHTML.push(siblingHTML);
					}
				return siblingHTML;
				}

				else if(!first[i] && next[i]){
					const TagAttributes = inlin
					const childHTML = GetNestedHTML();
					let parentHTML = React.createElement(TagName, TagAttributes, childHTML);
					if ( i === 0){
						returnHTML.push(parentHTML);
					}
				}

				else if(first[i] && !next[i]){
					let childHTML = React.createElement(TagName, TagAttributes);
					setter++;
				return childHTML;
				}
			}
		}
	}
}