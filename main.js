function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Mob extends PIXI.Sprite
{
    constructor(container) {
        super(PIXI.Texture.fromImage('mob'));
        this.x = getRandomInt(0, 750);
        this.y = getRandomInt(0, -2000);
        this.speed = getRandomInt(3, 6);
        container.addChild(this);
    }

    update() {
        this.y += this.speed;
        if (this.y > 600) {
            this.x = getRandomInt(0, 750);
            this.y = getRandomInt(0, -2000);
            this.speed = getRandomInt(3, 6);
        }
    }
}

class Game
{
    constructor() {
        this.mainContainer = new PIXI.Container();
        this.loader = new PIXI.loaders.Loader();
        this.renderer = new PIXI.autoDetectRenderer(
            800,
            600,
            {transparent: false}
        );
        this.speed = 0;
        this.mobs = [];
        this.health = 100;
        this.txtStyle = new PIXI.TextStyle({
            fontSize: 50,
            fill: ['#ffffff']
        });
        this.txt = new PIXI.Text(this.health, this.txtStyle);
        this.mainContainer.addChild(this.txt);
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.body.appendChild(this.renderer.view);
        this.load();
    }

    onKeyDown(e) {
        if (e.keyCode == 39) //right
            this.speed = 10;
        else if (e.keyCode == 37) //left
            this.speed = -10;
    }

    load() {
        this.loader
            .add('player', 'redSquare.png')
            .add('mob', 'blueSquare.png')
            .load(this.onLoad.bind(this));
    }

    onLoad() {
        this.player = new PIXI.Sprite.fromImage('player');
        this.player.x = 400;
        this.player.y = 550;
        for (let i = 0; i < 30; i++)
            this.mobs.push(new Mob(this.mainContainer));
        this.mainContainer.addChild(this.player);
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        if (this.speed > 0 && this.player.x < 750)
            this.player.x += this.speed;
        else if (this.speed < 0 && this.player.x > 0)
            this.player.x += this.speed;

        this.mobs.forEach((e) => {
            e.update();
            if (e.x <= this.player.x + 50 &&
                e.x + 20 >= this.player.x &&
                e.y <= this.player.y + 50 &&
                e.y + 20 >= this.player.y) {
                this.health -= 1;
                this.txt.text = this.health;
            }
        });

        if (this.health <= 0)
            alert("You died.");
        this.renderer.render(this.mainContainer);
        requestAnimationFrame(this.update.bind(this));
    }
}
