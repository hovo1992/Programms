 $(function(){
'use strict';
const METER_PART = 25,
	PROCENT = 100,
	METER_WIDTH = 103,
	METER_MAX = 200,
	PREV = 'Prev',
	NEXT = 'Next',
	SCREEN = 'Screen';

var rangeList = $('td .range'),
	trList = $('#tbody').find('[id^=tr]'),
	count = 0,
	sumEl = $('#tfoot .price'),
	meter = $('#tfoot #meter'),
	progress = $('#tfoot progress'),
	inputList = $('td input'),
	index = 0,
	sumPercent = 0,
	percentList = new Int32Array(4),
	partList = new Int32Array(4),
	radioList = $('td [type=radio]'),
	sumPart = 0,
	pointer = 0,
	checkBoxes = $('td .extinct_box'),
	checkRadio = $('th:nth-of-type(4), th:nth-of-type(5), th:nth-of-type(6)'),
	rbtCheckedArr = [],
	extinct = $('thead #extinct'),
	countList = [],
	ddContent = $('dl dd');

for (let i = 0; i < ddContent.length; i++) {
	var pattern = /^\s+$/,
		msg;

	ddContent[i].on('click', function() {
		if(!checkBoxes[i].prop('checked')){
			msg = prompt('Enter text: ', this.text());
			if(!pattern.test(msg) && msg != "")
			this.text(msg);
		}
	});
}

for (let i = 0; i < checkRadio.length; i++) {
	checkRadio[i].on('click', function() { 
		checkAll(i); 
	});
}

function checkAll(number) {
	rbtCheckedArr = $('td:nth-child(' + (number + 4) +') .radio');

	for (let i = 0; i < rbtCheckedArr.length; i++) {
		rbtCheckedArr[i].click();
	}
}

for (let i = 0; i < checkBoxes.length; i++) {
	checkBoxes[i].on('click', function() { 
	 	(checkBoxes[i].prop('checked') ? refuse : allow)(i);
	 	computeMeter(i);
	 	computeProgress(i);
	});
}

function refuse(i) {
	var parent = trList[i],
		ranges = parent.find('[type=range]'),
		buttons = parent.find('[type=button]'),
		radios = parent.find('[type=radio]');

	ranges.attr('readonly', 'readonly')
		.val(function() {
			return this.prop('min'); 
		})
		.css('cursor', 'not-allowed')
		.closest('tr')
		.find('[type=text]')
		.val(0);

	for (let j = 0; j < buttons.length; j++) { ///forEach
		buttons[j]
			.attr('disabled', 'disabled')
			.css('cursor', 'not-allowed');
	}

	for (let j = 0; j < radios.length; j++) { ///forEach
		radios[j].attr('disabled', 'disabled')
			.removeProp('checked')
			.css('cursor', 'not-allowed');
	}
};

for (let i = 0; i < radioList.length; i++) {
	if(!(i%3)) {
		radioList[i].prop('checked', 'checked');
	}

	radioList[i].on('click', function() { 
		computeProgress(Math.floor(i / 3), i); 
	});
}

function computeProgress(index, pointer) {
	pointer = null == pointer ? index : pointer;
	partList[index] = radioList[pointer].val() * trList[index].find('[type=text]').val();
	sumPart = 48;

	for (let i = 0; i < partList.length; i++) {
		sumPart += partList[i];
	}

	progress.val(sumPart);
}

for (let i = 0; i < rangeList.length; i++) {
	rangeList[i].on('input', function(){ 
		computeMeter(i); 
	});
}

function computeMeter(i) {
	var max = rangeList[i].max,
		min = rangeList[i].min,
		_min,
		_max;
		
	for (let j = 0; j < percentList.length; j++) {
		_min =rangeList[j].min, _max =rangeList[j].max;
		percentList[j] = ((rangeList[j].val() - _min) / (_max - _min)) * METER_PART;
	}

	percentList[i] = ((rangeList[i].val() - min) / (max - min)) * METER_PART;
	sumPercent = 0;

	for (let j = 0; j < percentList.length; j++) {
	 	sumPercent += percentList[j];
	}

	meter.val((meter.max - meter.min) * sumPercent / PROCENT + meter.min);
}

extinct.on('click', checkExtinct);

function checkExtinct() {
	var checkedExtincts = [];
	
	for (let i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked) {
			checkedExtincts.push(checkBoxes[i]);
		}
	}

	for (let isUnchecked = checkedExtincts.length != checkBoxes.length, i = 0; i < checkBoxes.length; i++) {
		 (isUnchecked ? refuse : allow)(i);
		checkBoxes[i].checked = isUnchecked;
	}
}
	
function changeValue() {
	sumEl.text((meter.val() * progress.val()).toFixed());
}

meter.on('change', function() {changeValue() }); ////////////////////////////////////////

function allow(i) {
	var parent = trList[i],
		ranges = parent.find('[type=range]'),
		buttons = parent.find('[type=button]'),
		radios = parent.find('[type=radio]');

	ranges
		.removeAttr('readonly')
		.css('cursor', 'auto');

	for (let i = 0; i < buttons.length; i++) {
		buttons[i]
			.removeAttr('disabled')
			.css('cursor', 'auto');
	}

	for (let i = 0; i < radios.length; i++) {
		radios[i]
			.removeProp('disabled')
			.css('cursor', 'auto');
		if(!i) {
			radios[i].prop('checked', 'checked');
		}
	}
}

meter.on('mousedown', function(e) {
	calculate(e);
	meter.on('mousedown, mousemove', calculate);
	document.on('mouseup', function() {
		meter.off('mousemove', calculate);
	});
	meter.on('mousemove', calculate);
});

var calculate = function(e) {
	meter.val(((e.offsetX) / METER_WIDTH) * METER_MAX);
	for (let i = 0; i < rangeList.length; i++) {
		rangeList[i].val(+rangeList[i].min +
		 ((rangeList[i].max - rangeList[i].min)
		 	*
		 	(meter.val() / (meter.max - meter.min))));
	}
};

for (let i = 0; i < inputList.length; i++) {
	if(-1 !=[PREV, SCREEN, NEXT].indexOf(inputList[i].name)) {
		countList.push(inputList[i]);
	}
}

for (let i = 0; i < countList.length; i++) {
	if('button' == countList[i].type) {
		countList[i].on('click', function() {
			index = i + (i % 3 == 0 ? 1 : -1);
			var screen = countList[index];
			screen.val((+screen.val() + i % 3 - 1) % 5);

			for (let j = 0; j < 3; j++) {
				var pointer =  trList[Math.floor(i / 3)].find('[type=radio]')[j].prop('checked') * j;
				computeProgress(Math.floor(i / 3), pointer);
			}
		});
	}
}
});

// window.onload = function () {
// 	var allTags = document.querySelectorAll('body');
// 	for (var i = 0; i < allTags.length; i++) {
// 		allTags[i].onmousedown = function (e) {
// 			var text = e.innerText;
// 			var tagColor =e.currentTarget.css('color');
// 			console.log("%c"+'text',"color:"+'tagColor');
// 		}
// 	}
// }