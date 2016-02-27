var link = 'https://en.wikipedia.org/wiki/';

var qList = new Array(19),
	aList = new Array(53),
	liList = new Array(57),
	detailsList = new Array(4),
	olList = new Array(20),
	summaryList = new Array(4),
	div = $('<div>'),
	bdo = $('<bdo>'),
	title = $('<title>');


for (var i = 0; i < qList.length; i++) {
	qList[i] = $('<q>');
}

for (var i = 0; i < aList.length; i++) {
	aList[i] = $('<a>');
}

for (var i = 0; i < liList.length; i++) {
	liList[i] = $('<li>');
}

for (var i = 0; i < detailsList.length; i++) {
	detailsList[i] = $('<details>');
}

for (var i = 0; i < olList.length; i++) {
	olList[i] = $('<ol>');
}

for (var i = 0; i < summaryList.length; i++) {
	summaryList[i] = $('<li>');
}

qList[0].content('Chrotogale owstoni');

aList[0]
.content('Owston`s palm civet')
.attr('href', link + 'Owston%27s_palm_civet')
.append(qList[0]);

olList[0].append(
	liList[0].append(
		aList[0]));

aList[1]
.content('Chrotogale')
.attr('href', link + 'Chrotogale');

liList[1].content('Genus');

liList[1].append(aList[1]).append(olList[0]);
olList[1].append(liList[1]);

document.body.append(olList[1]);



// document.body.append(
// 	olList[0].append(
// 		liList[0].append(aList[0]),
//         liList[1].append(aList[0]),
// 		));

// olList[0].append.apply(olList[0], liList);