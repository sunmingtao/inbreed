'use strict';
 
 function Person(name, father, mother){

	var myFather, myMother;
	
	doFather(father);
	doMother(mother);
	
	function doFather(father){
		if (notNull(father)){
			myFather = father;	
			return;
		}
		return myFather;
	}
	
	function doMother(mother){
		if (notNull(mother)){
			myMother = mother;		
			return;
		}
		return myMother;
	}
	
	function doHasFather(){
		return doHasParent(myFather);
	}
	
	function doHasMother(){
		return doHasParent(myMother);
	}
	
	function doHasParent(parent){
		return notNull(parent);
	}
	
	function doInbreedingCoefficient(){
		var fatherChains = doFatherChains();
		logChains(fatherChains, "Father chains of "+name);
		var motherChains = doMotherChains();
		logChains(motherChains, "Mother chains of "+name);
		var result = 0;
		for (var i=0; i<fatherChains.length; i++){
			for (var j=0; j<motherChains.length; j++){
				var num = numberGenerationToCommonAncestor(fatherChains[i], motherChains[j]);
				if (num) { //is a common ancestor
					var commonAncestor = fatherChains[i].fathestAncestor();
					console.log("Found common ancestor: "+commonAncestor.name+". Num is "+num);
					result += Math.pow(0.5, num)*(1+commonAncestor.inbreedingCoefficient());
				}
			}
		}
		return result;
	}
	
	function doFatherChains(){
		return doParentChains(myFather);
	}
	
	function doMotherChains(){
		return doParentChains(myMother);
	}
	
	function doParentChains(parent){
		var chains = [];
		if (doHasParent(parent)){
			chains.push(Chain([parent])); //parent itself
			var ancestors = parent.chains(); //All parents' ancestors
			for (var i = 0; i < ancestors.length; i++){
				var chain = ancestors[i];
				chain.prepend(parent);
				chains.push(chain);
			}
		}
		return chains;
	}
	
	function doChains(){
		return doFatherChains().concat(doMotherChains());
	}
	
	var publicAPI = {
		name: name,
		father: doFather,
		mother: doMother,
		hasFather: doHasFather,
		hasMother: doHasMother,
		fatherChains: doFatherChains,
		motherChains: doMotherChains,
		chains: doChains,
		inbreedingCoefficient: doInbreedingCoefficient
	};
	
	return publicAPI;
 }
 
 function Chain(persons){
	 var myChain = persons;
	 
	 function getChain(){
		 return myChain;
	 }
	 
	 function doPrepend(person){
		 myChain.unshift(person);
	 }
	 
	 function getLength(){
		 return myChain.length;
	 }
	 
	 function getFathestAncestor(){
		 return myChain.slice(-1)[0];
	 }
	 
	 function doToString(){
		 var result = '';
		 for (var i=0; i<persons.length; i++){
			 result += persons[i].name + ' ';
		 }
		 return result;
	 }
	 
	 return {
		chain : getChain,
		prepend: doPrepend,
		length: getLength,
		fathestAncestor: getFathestAncestor,
		toString: doToString
	 };
 }
 
//returns the number of nodes to go from start point of chain 1 (item 0) to common ancestor, then to the start point of chain 2
//if two pathways to the common ancestor share a portion of same route, return 0. chain 1 = [a, c, f, g], chain 2 = [b, d, f, g]. 
//In this case, f is deemed 'common ancestor', g is not (because fg is shared by both chains)
//e.g.1 chain 1 = [a, c, f], chain 2 = [b, f], then traverse acfb, return 4
//e.g.2 the start point itself is a common ancestor. chain 1 = [a], chain 2 = [b, a], then traverse ab, return 2
//e.g.3 if no common ancestor, return 0. chain 1 = [a, c], chain 2 = [b, d]
function numberGenerationToCommonAncestor(chain1, chain2){
	if (chain1.fathestAncestor() != chain2.fathestAncestor() || hasCloserCommonAncestor(chain1, chain2)){
		return 0;
	}
	return chain1.length() + chain2.length() - 1;
}

//Check if other closer common ancestor exists apart from the farthest common ancestor
 function hasCloserCommonAncestor(chain1, chain2){
	 var persons1 = chain1.chain().slice(); //make a copy
	 var persons2 = chain2.chain().slice();
	 persons1.pop(); //chop off the last item
	 persons2.pop();
	 for (var i=0; i<persons1.length; i++){
		 for (var j=0; j<persons2.length; j++){
			 if (persons1[i] == persons2[j]){
				 return true;
			 }
		 }
	 }
	 return false;
 }
 
 function logChains(chains, message){
	console.log(message); 
	for (var i=0; i<chains.length; i++) {
		console.log(chains[i].toString());
	}	 
 }
 
 
 function notNull(v){
	 return typeof v !== 'undefined' && v !== null;
 }
 
 
 