function AQData(baseData,timesteps){
  this.params={
    minVal:0,
    rangeVal:50,
    minValDisplayAvg:0,
    rangeValDisplayAvg:50,
    whoLimit:25,
    UKLimit:18
  }

  var testAverageRanges=[
    [15,34],
    [15,34],
    [15,34],
    [15,34],
    [15,34],
    [15,34],
    [15,34],
    [15,34]
  ];

  this.avg24Vals=new Array(8).fill(0);
  //=[22,34,20,21,25,23,19,21];

  // average pattern
  this.randomRanges=[
    [2,10],//2am
    [15,25],//5am
    [25,50],//8am
    [15,35],//11am
    [5,26],//2pm
    [25,40],//5pm
    [10,35],//8pm
    [5,25],//11pm
    // [2,10],//5-6
    // [15,25],//7-8
    // [15,40],//9-10
    // [10,25],//11-12
    // [5,16],//13-14
    // [10,25],//15-16
    // [20,35],//17-18
    // [5,25],//19-20
    // [12,30],//21-23
  ];

  this.dataForUse=[];

  this.testCalculateAverages=function(){
    // for(var i=0; i<8; i++){
    //   this.avg24Vals[i]=floor(random(testAverageRanges[i][0],testAverageRanges[i][1])*10)/10;
    // }
    var locationTotals=new Array(8).fill(0);
    for(var j=0; j<8; j++){//rows of birds
      for(var i=0; i<8; i++){//locations
        locationTotals[i]+=this.dataForUse[j][i];
      }
    }
    for(var i=0; i<8; i++){//locations
      this.avg24Vals[i]=floor(10*locationTotals[i]/8)/10;
    }
  };

  this.recalculateAverages=function(){
    this.testCalculateAverages();
  };

  this.generateRandomTestData=function(){
    for(var j=0; j<8; j++){//rows of birds, 6,8,10,12,14,16,18,20
      var dataRow=[];
      for(var i=0; i<8; i++){//locations
        var range=this.randomRanges[j][1]-this.randomRanges[j][0]
        dataRow[i]=Math.random()*range+this.randomRanges[j][0];
      }
      this.dataForUse.push(dataRow);
    }
  };

  this.refreshData=function(){
    this.generateRandomTestData();
  };

  this.refreshData();
  this.recalculateAverages();
  console.log(this.dataForUse);
  console.log(this.avg24Vals);
}
