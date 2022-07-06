var par=9/16;//12/21;//3/4;
var orientLandscape=false; //true is normal projector orientation, flase is projector side mounted.)
var cw,ch,pw,ph,ox,oy;
var visualisation;
var numLocations=8;
var locationImages=[];
var locationLabels=[
  ["Wells","Road"],//"Airport Road",
  ["Brislington","Depot"],//"Black Castle",
  ["Colston","Avenue"],//"Beacon",
  ["Fishponds","Road"],//"Fishponds",
  ["Marlborough","Street"],//"BRI",
  ["Temple","Way"],//"Cabot",
  ["Parson","Street"],//"Parson Street",
  ["St. Pauls"]//"St Pauls",
];

var billboardPhrases=[];
var billboardChangeIntervalMinutes=0.25;//probably set to 10


var sparrowsPerWire=numLocations;
var numWires=8;
// var sparrowVis;

var birdFrames=[];
var flyFrames=[];
var dirtFrames=[];
var bgImgBillboards;
var bgImgBirds;
var numBirdFrames=9;
var numFlyFrames=8;
var numDirtFrames=4;
var wireLabels=["2 am", "5 am", "8 am", "11 am", "2 pm", "5 pm", "8 pm", "11 pm"];
var timesteps=[2,5,8,11,14,17,20,23];
// var placeLabels=["one","two","three","four","five","six","seven","eight"];
var baseData;


var palettes=[
  [249,181,196], //pale pink
  [240,205,160],  //peach
  [255,125,120], //mid pink
  [205,235,240], //pale blue
  [103,46,69], //maroon brown
  [0,85,128]//dark blue
];

var aqData;


function preload(){
  baseData=loadJSON('baseData.json');
  for(var i=0; i<numLocations; i++){
    locationImages.push(loadImage("assets/sensorsb"+nf(i+1,2,0)+".png"));
  }
  // billboardPhrases=loadStrings('billboard-words.txt');
  billboardPhrases[0]=loadStrings('phrases-i-need.txt');
  billboardPhrases[1]=loadStrings('phrases-i-go.txt');
  billboardPhrases[2]=loadStrings('phrases-i-feel.txt');
  // billboardINeeds=loadStrings('phrases-i-need.txt');
  for(var i=0; i<numBirdFrames; i++){
    birdFrames.push(loadImage("assets/sparrow0"+(i+1)+".png"));
  }
  for(var i=0; i<numFlyFrames; i++){
    flyFrames.push(loadImage("assets/sparrowFly0"+(i+1)+".png"));
  }
  for(var i=0; i<numDirtFrames; i++){
    dirtFrames.push(loadImage("assets/blot0"+(i+1)+".png"));
  }
  bgImgBillboards=loadImage("assets/bgImgBillboards.png");
  bgImgBirds=loadImage("assets/bgImgBirds.png");
}

function setup() {
  calcSize();
  createCanvas(cw,ch);
  aqData=new AQData(baseData,timesteps);
  //remove blank last line
  billboardPhrases[0].pop();
  billboardPhrases[1].pop();
  billboardPhrases[2].pop();
  //remove first line with prompt
  billboardPhrases[0].shift();
  billboardPhrases[1].shift();
  billboardPhrases[2].shift();
  // console.log(billboardPhrases)
  visualisation=new RenderVis(ox,oy,pw,ph,
                              locationImages,locationLabels,
                              billboardPhrases,billboardChangeIntervalMinutes,
                              numWires, numLocations,
                              birdFrames,flyFrames,dirtFrames, wireLabels, locationLabels,
                              bgImgBillboards,bgImgBirds,
                              palettes
                            );

  // aqData=new AQData(numWires,sparrowsPerWire);
}

//To be removed
function keyPressed(){
  if(key=="o" || key=="O"){
    orientLandscape=!orientLandscape;
    calcSize();
    resizeCanvas(cw,ch);
    visualisation=new RenderVis(ox,oy,pw,ph,
                                locationImages,locationLabels,
                                billboardPhrases,billboardChangeIntervalMinutes,
                                numWires, numLocations,
                                birdFrames,flyFrames,dirtFrames, wireLabels, locationLabels,
                                bgImgBillboards,bgImgBirds,
                                palettes
                              );
  }
}

function draw() {
  background(0);
  push();
  // before render
  if(orientLandscape){

  } else {
    rotate(orientLandscape?0:PI/2);
    translate(0, -width);
  }
  //do all rendering
  visualisation.show(aqData);
  // testCard();
  //after render
  pop();
  // textSize(40);
  // fill(0);
  // textAlign(CENTER, CENTER);
  // textFont("antarctican-headline");
  // text("ANTARCTICAN HEADLINE", width/2, height/2);
  // textFont("loretta");
  // text("loretta", width/2, height*0.75);
  // rectMode(CENTER);
  // for(var i=0; i<5; i++){
  //   fill(palettes[i][0],palettes[i][1],palettes[i][2])
  //   rect((i+1)*width/6,100,50,50);
  // }
}

function mousePressed(){
  visualisation.click();
}

function calcSize(){
  if(orientLandscape){
    ch=windowHeight;
    cw=windowWidth;
    if(cw/ch>par){
      ph=ch;
      pw=ph*par;
      oy=0;
      ox=(cw-pw)/2;
    } else {
      pw=cw;
      ph=pw/par;
      ox=0;
      oy=(ch-ph)/2;
    }
  } else {
    ch=windowHeight;
    cw=windowWidth;
    console.log(cw/ch,1/par)
    if(cw/ch>1/par){
      pw=ch;
      ph=pw/par;
      ox=0;
      oy=(cw-ph)/2;
    } else {
      ph=cw;
      pw=ph*par;
      oy=0;
      ox=(ch-pw)/2;
    }
  }
}

// function AQData(times,places){
//   var data=[];
//
//   for(var j=0; j<numWires; j++){
//     data[j]={};
//     data[j].values=[];
//     for(var i=0; i<sparrowsPerWire; i++){
//       data[j].values[i]=[0,0,0];
//     }
//     data[j].avg24=random();
//   }
//   console.log(data);
// }


function RenderVis(xo,yo,w,h,
                  locationImages,locationLabels,
                  billboardPhrases,billboardChangeIntervalMinutes,
                  numWires, numLocations,
                  birdFrames,flyFrames,dirtFrames, wireLabels, placeLabels,
                  bgImgBillboards,bgImgBirds,
                  palettes
                ){
  let vProp0=0.3;//0.25
  let vProp1=0.4;//0.45
  let vProp2=0.25;//0.3
  let vProp3=0.05;

  let y=0;
  // let billboards=new BillboardZone(xo+0,yo+y,w,h*vProp0);
  let billboards=new BBImage(xo+0,yo+y,w,h*vProp0,w*0.33,w*0.18, billboardPhrases, palettes, billboardChangeIntervalMinutes, bgImgBillboards);
  y+=h*vProp0;
  // let sparrows=new SparrowZone(xo+0,yo+y,w,h*vProp1);
  let sparrows=new SparrowVis(xo+0,yo+y,w,h*vProp1,numWires,numLocations,birdFrames,flyFrames,dirtFrames, bgImgBirds, wireLabels, placeLabels);
  y+=h*vProp1;
  let locationData=new LocationData(xo+0,yo+y,w,h*vProp2,numLocations,locationImages,locationLabels);
  y+=h*vProp2;

  sparrows.activateNext(aqData);
  let triggerIntervalMinutes=0.5;
  let triggerTime=setInterval(triggerUpdate,triggerIntervalMinutes*60*1000);

  function triggerUpdate(){
    console.log("trigger");
    sparrows.activateNext(aqData);
  }

  this.click=function(){
    sparrows.activateNext(aqData);
    billboards.change();
  };

  this.show=function(aqData){
    fill(255);//220
    noStroke();
    rectMode(CORNER);
    rect(xo,yo,w,h);
    // noStroke();
    // fill(255);
    // textAlign(CENTER, CENTER);
    // textSize(w*0.2);
    // text("blub",xo+w/2,yo+h/2);
    billboards.show();
    sparrows.show(palettes);
    locationData.show(aqData,palettes);
    locationText(xo+0,yo+y,w,h*vProp3);
  };

  function locationText(lx,ly,lw,lh){
    push();
    translate(lx,ly);
    fill(palettes[5][0],palettes[5][1],palettes[5][2]);
    // rect(0,0,w,h)
    noStroke();
    textFont("loretta");
    textSize(lh*0.35);
    textAlign(LEFT,TOP);
    text("24-hour average levels",lw*0.05,lh*0.0);
    text("Tuesday 26 April 2022",lw*0.05,lh*0.4);
    text("Nitrogen dioxide (NO2)",lw*0.55,lh*0.0);
    text("Air Monitor data from BCC",lw*0.55,lh*0.4);
    pop();
  }
}



function testCard(){
  noStroke();
  fill(220);
  rectMode(CORNER);
  rect(ox,oy,pw,ph);
  fill(128);
  ellipse(ox,oy,30);
  ellipse(ox+pw,oy,30);
  ellipse(ox+pw,oy+ph,30);
  ellipse(ox,oy+ph,30);
  fill(0,100);
  noStroke();
  textSize(pw*0.1);
  textAlign(CENTER, CENTER);
  text("hello",ox+pw*0.5,oy+ph*0.5,0);
}
