function SparrowVis(x,y,w,h, numWires,sparrowsPerWire,birdFrames,flyFrames,dirtFrames, bgImgBirds, wireLabels, placeLabels){
  var sparrows=[];
  var sparrowSize=h/36;
  var wires=[];
  var currentActiveWire=0;

  for(var j=numWires-1; j>=0; j--){
    var y0=(j+(j%2==0?-0.15:0.15))*h*0.95/numWires+sparrowSize*3;
    var y1=(j+(j%2==0?0.15:-0.15))*h*0.95/numWires+sparrowSize*3;
    var a=atan2(y1-y0,w);
    wires.push([y0,y1,a]);
    for(var i=0; i<sparrowsPerWire; i++){
      // var newSparrow=new Sparrow(w/2-w*0.45+(i+(j%2==0?0.4:0.6))*w*0.9/(sparrowsPerWire),y0,y1,w,sparrowSize*5,sparrowSize);
      var newSparrow=new Sparrow(w/2-w*0.5+(i+(j%2==0?0.4:0.6))*w*1.0/(sparrowsPerWire),y0,y1,w,sparrowSize*5,sparrowSize);
      newSparrow.setData([0,0,0]);
      newSparrow.addAnim(birdFrames,flyFrames);
      newSparrow.addDirt(dirtFrames);
      sparrows.push(newSparrow);
    }
  }

  this.setData=function(timeSlot,place,values){
    var sparrowIndex=timeSlot*sparrowsPerWire+place;
    // console.log(sparrowIndex);
    sparrows[sparrowIndex].setData(values);
  };

  this.setDataRow=function(timeSlot,aqData){
    for(var i=0; i<sparrowsPerWire; i++){
      var sparrowIndex=timeSlot*sparrowsPerWire+i;
      var relValue=aqData.dataForUse[timeSlot][i]/aqData.params.rangeVal;
      var values=[relValue,0,0];
      sparrows[sparrowIndex].setData(values,random(10)<5);
    }
    // var sparrowIndex=timeSlot*sparrowsPerWire+place;
    // // console.log(sparrowIndex);
    // sparrows[sparrowIndex].setData(values);
  };


  this.activateNext=function(aqData){
    if(currentActiveWire<numWires){
      this.setDataRow(currentActiveWire,aqData);
      for(var i=0; i<sparrowsPerWire; i++){
        var sparrowToActivate=sparrowsPerWire*currentActiveWire+i;
        sparrows[sparrowToActivate].activate();
      }
      currentActiveWire++;
    }
  };

  this.show=function(palettes){
    push();
    translate(x,y);
    image(bgImgBirds,0,0,w,h);
    noStroke();
    for(var i=0; i<sparrowsPerWire; i++){
      // fill(220-(i%2==0?0:20));
      // rect(w/2-w*0.45+(i)*w*0.9/(sparrowsPerWire),0,w*0.9/(sparrowsPerWire),h);
      // fill(0);
      // noStroke();
      // textFont("antarctican-headline");
      // textSize(0.15*w*0.9/(sparrowsPerWire));//(sparrowSize*0.6);
      // textAlign(CENTER,BOTTOM);
      // text(placeLabels[i],w/2-w*0.45+(i+0.5)*w*0.9/(sparrowsPerWire),h);
    }
    noFill();
    stroke(0);
    for(var j=0; j<numWires; j++){
      line(0,wires[j][0],w,wires[j][1]);
      push();
      translate(0,wires[j][0]);
      rotate(wires[j][2]);
      fill(0);
      noStroke();
      textFont("loretta");
      textSize(0.2*w*0.9/(sparrowsPerWire));//(sparrowSize*0.5);
      textAlign(LEFT,BOTTOM);
      text(wireLabels[j],w*0.01,-sparrowSize*0.1);
      pop();
    }
    sparrows.forEach(function(sp){
      if(sp.active){
        sp.preShow();
        sp.show(palettes[0]);
        sp.run();
      }
    });
    pop();
  };
}

function Sparrow(x,y0,y1,w,r,s){
  var ox=x;
  var y=y0;
  var isFlying=false;
  var isHopping=false;
  var isArriving=true;
  var arriveRate=random(20,40);
  var arriveMaxRate=10;//random(5,8);
  var ttArrive=floor(random(60));
  var flyDir=-1;
  var flyA=0;
  var flyRot=PI/60;
  var flyEA=0;
  var flyAOffset=PI/2;
  var hopA=0;
  var hopRot=PI;
  var hopHeight=0;
  var hopDist=0;
  var hopDur=30;
  var ex=0;
  var ey=-y-width/2;
  var starter=random(10);
  if(starter<4){
    ex=w*1.1;
  } else if(starter<6){
    ex=x;
  } else {
    ex=w*-0.1;
  }
  var er=0;
  var isHoming=false;
  var cr=0, cg=0, cb=0;
  this.active=false;
  this.isEstimate=false;

  var trail=[];
  var trailMax=500;

  var soot=new Soot(ex, ey-s*0.7, s*0.5,s*0.4, 100);
  var anim=null;
  var dirt=null;
  var hasAnim=false;
  var hasDirt=false;
  y=y0+(y1-y0)*x/w;

  this.data=[0,0,0];
  this.health=0;

  function newHop(health){
    isHopping=true;
    hopHeight=random(0.1,0.5)*r*health;
    if(random(10)<4){
      hopDist=ox-x;
      // isHoming=true;
    } else {
      hopDist=random(-0.12,0.12)*r;
    }
    hopDur=15;//floor(random(10,20));
    hopRot=PI/hopDur;
    anim.setState(false);
  }

  this.addAnim=function(birdFrames,flyFrames){
    anim=new SparrowAnim(birdFrames,flyFrames);
    anim.setState(true);
    hasAnim=true;
  }

  this.addDirt=function(dirtFrames){
    dirt=new Dirt(dirtFrames,1-this.health,s);
    // console.log(1-this.health);
    hasDirt=true;
  }


  this.activate=function(){
    this.active=true;
  };

  this.setData=function(newData,isEst){
    this.isEstimate=isEst;
    // this.health=0;
    for(var i=0; i<newData.length; i++){
      this.data[i]=newData[i];
      // this.health+=newData[i];
    }
    this.health=1-newData[0];
    // console.log(newData[0],this.health);
    cr=this.health*255;
    cg=this.health*255;
    cb=this.health*255;
  }

  this.run=function(w){
    // isHoming=false;
    // y=y0+(y1-y0)*x/w;
    // ey=y;
    if(isFlying){
      flyEA=flyA+flyAOffset;
      var rel=sin(flyA/2);
      er=(0.7+noise(ex/170,ey/170+frameCount/50))*r*rel*this.health;
      ex=x+cos(flyEA)*er*flyDir;
      ey=y+sin(flyEA)*er;
      flyA+=flyRot;
      if(flyA>=TWO_PI){
        flyA=0;
        isFlying=false;
        anim.setState(false);
      }
    } else if(isArriving){
      if(ttArrive>0){
        ttArrive--;
      } else {
        ex+=constrain((x-ex)/arriveRate,-arriveMaxRate,arriveMaxRate);
        ey+=constrain((y-ey)/arriveRate,-arriveMaxRate,arriveMaxRate);
      }
      if(dist(ex,ey,x,y)<s*0.9){
        isArriving=false;
        anim.setState(false);
        ex=x;
        ey=y;
      }
    } else if(isHopping){
      x+=hopDist/hopDur;
      ex=x;
      ey=y-sin(hopA)*hopHeight;
      hopA+=hopRot;
      if(hopA>=PI){
        hopA=0;
        ey=y;
        isHopping=false;
      }
    } else {
      if(random(100)<4*this.health){
        if(random(10)<1){
          isFlying=true;
          flyDir=random(10)<5?-1:1;
          anim.setState(true);
        } else {
          newHop(this.health);
        }
      }
    }
    trail.unshift({x:ex, y:ey-s/2});
    if(trail.length>trailMax){
      trail.pop();
    }
    anim.run(1-this.health);
    dirt.run(ex,ey,1-this.health);
  };

  this.preShow=function(){
    soot.run(ex,ey,isFlying || isHopping || isArriving, 1-this.health);
  };

  this.show=function(palette){
    push();
    translate(ex,ey-s*0.8);
    anim.show(s,flyDir);
    pop();
    push();
    noStroke();
    // fill(255,0,0);
    fill(palette[0],palette[1],palette[2]);
    if(this.isEstimate){
      ellipse(ox,y+s*0.25,s*0.2);
    }
    pop();
  };
}

function Dirt(dirtFrames,level,s){
  var spots=[];
  var maxSpots=100*level;
  var numSpots=floor(level*maxSpots);
  var ttl=100*level;

  this.run=function(x,y,newLevel){
    level=newLevel;
    maxSpots=100*level;
    numSpots=floor(level*maxSpots);
    ttl=100*level;
    for(var i=spots.length-1; i>=0; i--){
      if(spots[i].run()){
        spots[i].show();
      } else {
        spots.splice(i,1);
      }
    }
    for(var i=0; i<1; i++){
      if(spots.length<numSpots && random(1)<level){
        spots.push(new DirtSpot(random(dirtFrames),x,y,ttl,s,level));
      }
    }
  };
}

function DirtSpot(frame,x,y,ttlMax,s,level){
  var ttl=ttlMax;
  var offA=floor(random(TWO_PI*3));
  var offX=cos(offA)*s*0.5;
  var offY=sin(offA)*s*0.8;
  var a=offA;//random(TWO_PI);

  this.run=function(){
    ttl--;
    return ttl>0;
  };

  this.show=function(){
    push();
    translate(x+offX,y-s+offY);
    rotate(a);
    scale(s/100);
    imageMode(CENTER);
    image(frame,0,0);
    pop();
  };
}

function SparrowAnim(birdFrames,flyFrames){
  var state=floor(random(flyFrames.length));
  var fps=4;
  var prevFrame=0;
  var frame=0;
  var fadeCurrent=0;
  var fadePrev=1;
  var animRate=60;
  var changeRate=1/10;
  var firstFlyFrame=0;
  var numFlyFrames=flyFrames.length;
  var currentFlyFrame=floor(random(flyFrames.length));
  var flyFrameInterval=1;
  var isFlying=false;
  var smudginess=0;
  var nOffX=random(100);
  var nOffY=random(100);
  var currentFrame=createImage(100,100);


  this.changeState=function(){
    state=(state+1)%4;
    this.changeFrame();
  }

  this.setState=function(isFly){
    if(isFly){
      isFlying=true;
    } else {
      state=floor(random(flyFrames.length));
      isFlying=false;
    }
    this.changeFrame();
  }

  this.changeFrame=function(){
    if(isFlying){
      currentFrame=flyFrames[currentFlyFrame];
    } else {
      currentFrame=birdFrames[state];
    }
  }

  this.run=function(nonHealth){
    smudginess=nonHealth;
    if(fadePrev>0){
      fadePrev-=changeRate;
    }
    if(fadeCurrent<1){
      fadeCurrent+=changeRate;
    }
    if(isFlying){
      if(frameCount%flyFrameInterval==0){
        currentFlyFrame=(currentFlyFrame-firstFlyFrame+1)%numFlyFrames+firstFlyFrame;
        this.changeFrame();
      }
    }
  };

  this.show=function(s,dir){
    imageMode(CENTER);
    // tint(0,100);
    scale(dir*s/24,s/24);
    image(currentFrame,0,-s*0.2);
  };
}

function Soot(x,y,r,s,n){
  var motes=[];

  this.run=function(nx, ny, isEmitting, strength){
    x=nx;
    y=ny;
    if(isEmitting && motes.length<n && random(10)<10*strength){
      motes.push(new Mote(x,y,r,s*strength));
    }
    for(var i=motes.length-1; i>=0; i--){
      if(motes[i].run()){
        motes[i].show();
      } else {
        motes.splice(i,1);
      }
    }
  }
}

function Mote(x,y,r,s){
  var energy=1.5;
  var ttlMax=60;
  var ttl=ttlMax;
  var a=random(-1.5,0.5)*PI;
  var vel=p5.Vector.fromAngle(a).mult(energy);
  var pos=createVector(x+cos(a)*r,y+sin(a)*r);
  var fall=0.05;

  this.show=function(){
    fill(0,180*ttl/ttlMax);
    noStroke();
    ellipse(pos.x,pos.y,s*0.1+s*0.9*ttl/ttlMax);
  };

  this.run=function(){
    vel.y+=fall;
    vel.mult(0.99);
    pos.add(vel);
    ttl--;
    return ttl>0;
  };
}
