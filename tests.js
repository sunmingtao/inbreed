QUnit.test( "Person.init", function( assert ) {
	var a = Person('a');
	assert.equal( a.name, 'a');
	var b = Person('b');
	var c = Person('c', a , b);
	assert.equal(c.mother().name, b.name);
	var d = Person('d');
	d.father(a);
	d.mother(b);
	assert.equal(d.mother().name, b.name);
});

QUnit.test( "Person.hasFatherMother", function( assert ) {
	var a = Person('a');
	assert.equal( a.hasFather(), false);
	var b = Person('b');
	var c = Person('c', a , b);
	assert.equal( c.hasFather(), true);
	var d = Person('d');
	d.father(a);
	d.mother(b);
	assert.equal( d.hasMother(), true);
});

QUnit.test( "Person.chain", function( assert ) {
	var a = Person('a');
	assert.equal( a.fatherChains().length, 0);
	var b = Person('b');
	var c = Person('c', a , b);
	assert.equal( c.fatherChains().length, 1);
	assert.equal( c.fatherChains()[0].chain()[0].name, 'a');
});

QUnit.test( "Person.longer.chain", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var c = Person('c', a , b);
	var d = Person('d');
	var e = Person('e', c, d);
	assert.equal( e.fatherChains().length, 3);
	assert.equal( e.fatherChains()[0].chain().length, 1); 
	assert.equal( e.fatherChains()[0].chain()[0].name, 'c');
	assert.equal( e.fatherChains()[1].chain().length, 2);
	assert.equal( e.fatherChains()[1].chain()[0].name, 'c');
	assert.equal( e.fatherChains()[1].fathestAncestor().name, 'a');
	assert.equal( e.fatherChains()[2].chain().length, 2);
	assert.equal( e.fatherChains()[2].chain()[0].name, 'c');
	assert.equal( e.fatherChains()[2].fathestAncestor().name, 'b');
});

QUnit.test( "Chain.prepend", function( assert ) {
	var a = Person('a');
	var chain = Chain([a]);
	assert.equal( chain.length(), 1);
	var b = Person('b');
	chain.prepend(b);
	assert.equal( chain.length(), 2);
	assert.equal( chain.chain()[0].name, 'b');
});

QUnit.test("numberGenerationToCommonAncestor", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var c = Person('c');
	var d = Person('d');
	var e = Person('e');
	var chain1 = Chain([a]);
	var chain2 = Chain([b]);
	assert.equal(numberGenerationToCommonAncestor(chain1, chain2), 0);
	var chain1 = Chain([c, b]);
	var chain2 = Chain([b]);
	assert.equal(numberGenerationToCommonAncestor(chain1, chain2), 2);
	var chain1 = Chain([c, a]);
	var chain2 = Chain([d, a]);
	assert.equal(numberGenerationToCommonAncestor(chain1, chain2), 3);
	var chain1 = Chain([c, a, b]);
	var chain2 = Chain([d, a, b]);
	assert.equal(numberGenerationToCommonAncestor(chain1, chain2), 0);
});

QUnit.test("Person.inbreedingCoefficient.notInbred", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var x = Person('x', a, b);
	assert.equal(x.inbreedingCoefficient(), 0);
});

QUnit.test("Person.inbreedingCoefficient.fullSibling", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var c = Person('c', a, b);
	var d = Person('d', a, b);
	var x = Person('x', c, d);
	assert.equal(x.inbreedingCoefficient(), 0.25);
});

QUnit.test("Person.inbreedingCoefficient.halfSibling", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var c = Person('c');
	var d = Person('d', a, b);
	var e = Person('e', b, c);
	var x = Person('x', d, e);
	assert.equal(x.inbreedingCoefficient(), 0.125);
});

QUnit.test("Person.inbreedingCoefficient.fatherDaught", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var c = Person('c', a, b);
	var x = Person('x', a, c);
	assert.equal(x.inbreedingCoefficient(), 0.25);
});

QUnit.test("Person.inbreedingCoefficient.firstCousin", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var c = Person('c', a, b);
	var d = Person('d', a, b);
	var e = Person('e');
	var f = Person('f');
	var g = Person('g', c, e);
	var h = Person('h', d, f);
	var x = Person('x', g, h);
	assert.equal(x.inbreedingCoefficient(), 0.0625);
});

QUnit.test("Person.inbreedingCoefficient.complex", function( assert ) {
	var F = Person('F');
	var E = Person('E');
	var G = Person('G');
	var M = Person('M');
	var C = Person('C', F, E);
	var D = Person('D', E, G);
	var H = Person('H', G, M);
	var A = Person('A', C, D);
	var B = Person('B', A, H);
	var X = Person('X', A, B);
	assert.equal(X.inbreedingCoefficient(), 0.3125);
});

QUnit.test("Person.inbreedingCoefficient.deepInbred", function( assert ) {
	var a = Person('a');
	var b = Person('b');
	var c = Person('c', a, b);
	var d = Person('d', a, b);
	var e = Person('e', c, d);
	var f = Person('f', c, d);
	var g = Person('g', e, f);
	var h = Person('h', e, f);
	var x = Person('x', g, h);
	assert.equal(x.inbreedingCoefficient(), 0.5);
});