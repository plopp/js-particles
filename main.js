function Particle(_x,_y){
	this.x = _x;
	this.y = _y;
	this.vx = 0;
	this.vy = 0;
	this.fx = 0;
	this.fy = 0;
	this.m = 1;

    // x-dot          A        x           B     u
    //  __     ______________  __      ________  __
	//  ax     [0   0   0   0] vx      [1/m 0  ]
    //  vx  =  [1   0   0   0] x    +  [0   0  ] fx    
	//  ay     [0   0   0   0] vy      [0   1/m] fy
	//  vy     [0   0   1   0] y       [0   0  ]

	//Solution: q(t) = e^At*q(0) + int_0^t{e^(A(t-tau))*Bx(tau)dtau}
	//For constant input during the sample period, the solution can be simplified:
    //q(t) = e^(At)*q(0)
    //For small t, e^Mt can be approximated to:
    //e^Mt = I + Mt
    //So the state space becomes:

    // x(t+1)        A        x(t)           B     u
    //  __     ______________  __      ________  __
	//  vx     [1   0   0   0] vx      [1/m 0  ]
    //  x   =  [t   1   0   0] x    +  [0   0  ] fx    
	//  vy     [0   0   1   0] vy      [0   1/m] fy
	//  y      [0   0   t   1] y       [0   0  ]

	this.step = function(_t){
		var t = _t/1000;
		this.vx = this.vx + (1/this.m)*this.fx;
        this.vy = this.vy + (1/this.m)*this.fy;
        this.x = this.vx*t + this.x;
        this.y = this.vy*t + this.y; 
	}

	this.setForce = function(_fx,_fy){
        this.fx = _fx;
        this.fy = _fy;
    }
 
    this.reset = function(){
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
	}
}

function Simulation(){
	this.init = function(){
		this.canvas = document.getElementById('myCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.webkitImageSmoothingEnabled = false;
		this.canvas.width = 800;
		this.canvas.height = 600;
		this.t = 10;
		this.frame = 0;
		this.particles = [];
		this.cx = this.canvas.width/2;
		this.cy = this.canvas.height/2;
    	for(var i = 0; i<10; i++){
			this.particles.push(new Particle(this.canvas.width/2,this.canvas.height/2));
		}
	}

    this.run = function(){
    	var sim = this; //Save the scope context to variable before entering setInterval
	    this.timer = setInterval(function(){
	    	sim.frame++;
	        for(var i = 0; i<sim.particles.length; i++){
	        	sim.particles[i].setForce(10*Math.random()-5,10*Math.random()-5);
	        	sim.particles[i].step(sim.t);
				sim.draw();
			}
		},this.t);
	}

    this.reset = function(){
		clearInterval(this.timer);
	}

	this.draw = function(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.globalAlpha = 1;
		this.particles.forEach(function(p) {
			this.sim.ctx.beginPath();
			this.sim.ctx.arc(p.x, p.y, 10, 0, 2*Math.PI);
	 		this.sim.ctx.lineWidth = 1.0;
	 		this.sim.ctx.strokeStyle = '#00ff00';
	 		this.sim.ctx.stroke();
		});
	}

}

