function gatRandomValue(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
};
const app = Vue.createApp({
    template: `
        <section id="monster" class="container">
        <h2>Monster Health</h2>
        <div class="healthbar">
        <div class="healthbar__value" :style="monsterBarStyles"></div>
        </div>
    </section>
    <section id="player" class="container">
        <h2>Your Health</h2>
        <div class="healthbar">
        <div class="healthbar__value" :style="playerBarStyles"></div>
        </div>
    </section>
    <section class="container" v-if="winner">
        <h2>Game Over!</h2>
        <h3 v-if="winner ==='monster'">Monnster Won! <br><img class="wining-svg" src="img/monster.svg" alt="monster"></h3>
        <h3 v-else-if="winner ==='player'"> You Won! <br><img class="wining-svg" src="img/player.svg" alt="player"> </h3>
        <h3 v-else="winner ==='draw'">It's a draw! <br><img class="wining-svg" src="img/white-flag.svg" alt="draw"></h3>
        <button class="newgame-button" @click="startGame">Start New Game</button>
    </section>
    <section id="controls" v-else>
        <button @click="attackMonster">ATTACK <img class="button-svg" src="img/attack.svg" alt=""></button>
        <button :disabled="mayUseSpecialAttack" @click="specialAttackMonster">SPECIAL ATTACK <img class="button-svg" src="img/special.svg" alt=""></button>
        <button @click="healPlayer">HEAL <img class="button-svg" src="img/heal.svg" alt=""></button>
        <button @click="surrender">SURRENDER <img class="button-svg" src="img/surrender.svg" alt=""></button>
    </section>
    <section id="log" class="container">
        <h2>Battle Log</h2>
        <ul >
        <li v-for="logMessage in logMessages">
            <span :class="{'log--player': logMessage.actionBy === 'player', 'log--monster': logMessage.actionBy === 'monster'}">{{ logMessage.actionBy === 'player' ? 'Player' : 'Monter' }}</span>
            <span v-if="logMessage.actionType === 'heal'"> heals himself for <span class="log--heal">{{ logMessage.actionValue }}</span></span>
            <span v-else> attacks and deals <span class="log--damage">{{ logMessage.actionValue}}</span></span>
        </li>
        </ul>
    </section>`,   
    data() {
        return{
        playerHealth: 100,
        monsterHealth: 100,
        currentRound: 0,
        winner: null,
        logMessages: []
        }
    },
    computed: {
        monsterBarStyles(){
            if (this.monsterHealth < 0) {
                return {width: '0%'}
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles(){
            if (this.playerHealth < 0) {
                return {width: '0%'}
            }
            return {width: this.playerHealth + '%'}
        },
        mayUseSpecialAttack(){
            return this.currentRound % 3 !== 0
        }
    },
    watch: {
        playerHealth(value){
            if (value <= 0 && this.monsterHealth <= 0) {
                //draw
                this.winner = 'draw';
            } else if (value <= 0 ) {
                //monster win
                this.winner = 'monster';
            } 
        },
        monsterHealth(value){
            if (value <= 0 && this.playerHealth <= 0) {
                //draw
                this.winner = 'draw';
            } else if (value <= 0 ) {
                // player win
                this.winner = 'player';
            } 
        },
    },
    methods: {
        startGame(){
            this.playerHealth= 100;
            this.monsterHealth= 100;
            this.currentRound= 0;
            this.winner= null;
            this.logMessages= [];
        },
        attackMonster(){
            this.currentRound++;
            const attackValue =  gatRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'attacked', attackValue);
            this.attackPlayer();
        },  
        attackPlayer(){
            const attackValue =  gatRandomValue(7, 12)
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attacked', attackValue);
        },
        specialAttackMonster(){
            this.currentRound++;
            const attackValue =  gatRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player', 'special-attacked', attackValue);
            this.attackPlayer();
        },
        healPlayer(){
            this.currentRound++;
            const healValue = gatRandomValue(8, 20);
            if (this.playerHealth + healValue > 100){
                this.playerHealth = 100;
            } else{
                this.playerHealth += healValue;
            }
            this.addLogMessage('player', 'heal', healValue)
            this.attackPlayer();
        },
        surrender(){
            this.winner= 'monster';
        },
        addLogMessage (who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            })
        }
    }
});

app.mount('#game')