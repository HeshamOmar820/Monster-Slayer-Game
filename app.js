function gatRandomValue(min, max){
    return Math.floor(Math.random() * (max - min) ) + min;
};
const app = Vue.createApp({
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
            this.addLogMessage('player', 'healed', healValue)
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