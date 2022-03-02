function start(){
    $("#inicio").hide();    
    $("#backGame").append("<div id='player' class='animation1' > </div>");
    $("#backGame").append("<div id='enemy1' class='animation2'> </div>");
    $("#backGame").append("<div id='enemy2'> </div>");
    $("#backGame").append("<div id='friend' class='animation3'> </div>");
    $("#backGame").append("<div id='placar'> </div>");
    $("#backGame").append("<div id='energia'> </div>");

    var TECLA = { W: 87, S: 83, J: 74 }
    var velocidade = 5;
    var posY = parseInt(Math.random() * 334);
    var jogo = {}
    var podeAtirar = true;
    var gameOver = false;
    var pontos=0;
    var salvos=0;
    var perdidos=0;
    var energiaAtual=3;

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    jogo.pressionou = [];

	$(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
        });    

    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });

    
    
    jogo.timer = setInterval(loop,30);
    
    function loop(){
        moveBackg(); 
        movePlayer();
        moveEnemy1();
        moveEnemy2();
        moveFriend();
        colisao();
        placar();
        energia();
    }
    
    function moveBackg(){
        left = parseInt($("#backGame").css("background-position"));
	    $("#backGame").css("background-position",left-1);
    }

    function movePlayer() {
    
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top",topo-10);
            
            if(topo <= 0){
                $("#player").css("top",topo+10);
            }
        }
        
        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#player").css("top"));
            $("#player").css("top",topo+10);	
            
            if(topo >= 434){
                $("#player").css("top",topo-10);	
            }
        }
        
        if (jogo.pressionou[TECLA.J]) {
            shot();
        }
    
    }
    
    function moveEnemy1(){
        posX = parseInt($("#enemy1").css("left"));
        $("#enemy1").css("left",posX-velocidade);
        $("#enemy1").css("top",posY);
            
		if (posX<=0) {
		posY = parseInt(Math.random() * 334);
		$("#enemy1").css("left",694);
		$("#enemy1").css("top",posY);
			
		}
    }

    function moveEnemy2(){
        posX = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left",posX-3);
            
		if (posX<=0) {
    		$("#enemy2").css("left",775);
		}
    }

    function moveFriend(){
        posX = parseInt($("#friend").css("left"));
        $("#friend").css("left",posX+1);
            
		if (posX >= 906) {
    		$("#friend").css("left",0);
		}
    }

    function shot() {
        somDisparo.play();
        if (podeAtirar==true) {
            
        podeAtirar=false;
        
        topo = parseInt($("#player").css("top"))
        posX = parseInt($("#player").css("left"))
        tiroX = posX + 190;
        topoTiro = topo + 37;
        $("#backGame").append("<div id='shot'></div");
        $("#shot").css("top",topoTiro);
        $("#shot").css("left",tiroX);
        
        var tempoDisparo = window.setInterval(executaDisparo, 30);
        
        } 
     
        function executaDisparo() {
            posX = parseInt($("#shot").css("left"));
            $("#shot").css("left",posX+15); 
        
            if (posX>900) {             
                window.clearInterval(tempoDisparo);
                tempoDisparo=null;
                $("#shot").remove();
                podeAtirar=true;                    
            }
        } 
    } 

    function colisao(){
        var colisao1 = ($("#player").collision($("#enemy1")));
        var colisao2 = ($("#player").collision($("#enemy2")));
        var colisao3 = ($("#shot").collision($("#enemy1")));
        var colisao4 = ($("#shot").collision($("#enemy2")));
        var colisao5 = ($("#player").collision($("#friend")));
        var colisao6 = ($("#enemy2").collision($("#friend")));
        
        // Player vs Enemy 1 
        if (colisao1.length>0) {
            energiaAtual--;
            inimigo1X = parseInt($("#enemy1").css("left"));
            inimigo1Y = parseInt($("#enemy1").css("top"));
            explosao1(inimigo1X,inimigo1Y);  
            posY = parseInt(Math.random() * 334);
            $("#enemy1").css("left",694);
            $("#enemy1").css("top",posY);
        }

        // Player vs Enemy 2 
        if (colisao2.length>0) {
            energiaAtual--;
            inimigo2X = parseInt($("#enemy2").css("left"));
            inimigo2Y = parseInt($("#enemy2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
            $("#enemy2").remove();
            respawnTruck();            
        }	

        // Shot vs Enemy 1
        if (colisao3.length>0) {
            velocidade = velocidade + 0.3;
            pontos=pontos+100;
            inimigo1X = parseInt($("#enemy1").css("left"));
            inimigo1Y = parseInt($("#enemy1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
            $("#shot").css("left",950);
                
            posY = parseInt(Math.random() * 334);
            $("#enemy1").css("left",694);
            $("#enemy1").css("top",posY);
                
        }

        // Shot vs Enemy 2
        if (colisao4.length>0) {
            velocidade += 0.1;
            pontos=pontos+ 50;
            inimigo2X = parseInt($("#enemy2").css("left"));
            inimigo2Y = parseInt($("#enemy2").css("top"));
            $("#enemy2").remove();
        
            explosao2(inimigo2X,inimigo2Y);
            $("#shot").css("left",950);
            respawnTruck();
        }

        // Player saves Friend
        if (colisao5.length>0) {
            somResgate.play();
            salvos++;
            respawnFriend();
            $("#friend").remove();
        }
        
        // Friend vs Enemy 2
        if (colisao6.length>0) {
            perdidos++;
            amigoX = parseInt($("#friend").css("left"));
            amigoY = parseInt($("#friend").css("top"));
            
            explosao3(amigoX,amigoY);
            $("#friend").remove();
            respawnFriend();
        }
    }

    //Explosion 
    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
        $("#backGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var div=$("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao = window.setInterval(removeExplosao, 1000);
        
        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao=null;
        }
    }
	
	function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
        $("#backGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
            function removeExplosao2() {
                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2=null;   
            }   
    }

    function explosao3(amigoX,amigoY) {
        somPerdido.play();
        $("#backGame").append("<div id='explosao3' class='animation4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
        
        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3=null;       
        }
    }

    function respawnTruck() {
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);
        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4=null;
            if (gameOver==false) {
                $("#backGame").append("<div id=enemy2></div");    
            }                
        }	
    }	

    function respawnFriend() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            if (gameOver == false) {
                $("#backGame").append("<div id='friend' class='animation3'></div>");
            }        
        }
    }

    function placar() {
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>"); 
        if(pontos == 2000 || pontos == 4000){
            energia++;
        }   
    }

    function energia() {
	
		if (energiaAtual==3) {
			
			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}
	
		if (energiaAtual==2) {
			
			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}
	
		if (energiaAtual==1) {
			
			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}
	
		if (energiaAtual==0) {
			
			$("#energia").css("background-image", "url(imgs/energia0.png)");
			gameover();
		}
	
	}
    
    function gameover() {
        gameOver = true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer);
        jogo.timer=null;
        
        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();
        
        $("#backGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Fim de Jogo </h1><p>Sua pontuaçãoo foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    }
}

function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
}

	

	
