window.onload = function(){
	$(".lst2, .lst3, .lst4").css({"display":"none"});
	$(".map").css({"background-image":"url(./img/back01.png)"});
	$("#opa2, #opa3, #opa4").css({"background-color":"black","opacity":"0.2"});
};

function touch(su){
	$(".map").css({"background-image":"url(./img/back0"+su+".png)"});
	$(".lst1, .lst2, .lst3, .lst4").css({"display":"none"});
	$(".lst"+su).css({"display":"block"});
	$("#opa1, #opa2, #opa3, #opa4").css({"background-color":"black","opacity":"0.2"});
	$("#opa"+su).css({"opacity":"0"});
}
