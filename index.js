const fs = require('fs');
var txt_to_read="qqlist.txt";
var linePerOutputFile = 10000;
var ctr =0;
var page = 0;
var LineByLineReader = require('line-by-line'),lr = new LineByLineReader(txt_to_read);



var date =new Date().toISOString().replace(".","-");
date = replaceAll(date,":","-");
fs.mkdirSync(date)
fs.chmodSync(date, 0777);
console.log("created new folder for current run" + date);
date += "/";



var logger = fs.createWriteStream(date  + "page"+ page + ".txt", {
  flags: 'w+'
});


lr.on('error', function (err) {
	console.log(err);
});

lr.on('line', function (line) {
	var re = /.+@qq.com/i;
	var out = re.exec(line) || [];
	
	if(typeof out[0] != "undefined"){
		 logger.write(out[0] + "\r\n")
		 ctr++;

		 if(ctr > linePerOutputFile){
		 	page++;
		 	ctr =0;
		 	logger.end();
		 	logger = fs.createWriteStream(date  + "page"+ page + ".txt",{  flags: 'w+'});
		 }
		 console.log("saving: " + out[0]);
	}

});

lr.on('end', function () {
	console.log("done saved to " + date +".txt");
	logger.end();
});




function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}