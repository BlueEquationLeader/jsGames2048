function Game2048(container)
{
    this.container = container;
    this.tiles = new Array(16);
}
    //prototypeԭ�͵ķ�ʽ �����������Ժͷ���
    //�˴����������ӷ���
Game2048.prototype = {
    //��ʼ��
    init: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            var tile = this.newTile(0);
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    },
    //��̬����DIV����ֵ
    newTile: function(val){
        var tile = document.createElement('div');
        this.setTileVal(tile, val);
        return tile;
    },
    //����ֵ������css��ʽ��ֵ�Ļ�ȡ�����
    setTileVal: function(tile, val){
        //prevTile currTile�ж����е�λ��
        tile.className = 'tile tile' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },
    //�������������Ӻ͸���
    randomTile: function(){
        var zeroTiles = [];
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                zeroTiles.push(this.tiles[i]);
            }
        }
        //���� ���ֳ��ֵ�λ��
        var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        //���� 2 4 ���ֵĸ���
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
    },
    //ͨ�������������ƶ�
    move:function(direction){
        var j;
        switch(direction){
            //��
            case 'W':
                //this.tiles.length=4*4
                //4-16ѭ��12��
                //console.log(len);
                for(var i = 4, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j >= 4){
                        this.merge(this.tiles[j - 4], this.tiles[j]);
                        //[0 4] [1 5] [2 6] [3 7]
                        //[4 8]
                        j -= 4;
                    }
                }
                break;
            //��
            case 'S':
                for(var i = 11; i >= 0; i--){
                    j = i;
                    while(j <= 11){
                        this.merge(this.tiles[j + 4], this.tiles[j]);
                        j += 4;
                    }
                }
                break;
            //��

            case 'A':
                for(var i = 1, len = this.tiles.length; i < len; i++){
                    j = i;
                    //�ų�4 8 12 16
                    while(j % 4 != 0){
                        this.merge(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            //��
            case 'D':
                for(var i = 14; i >= 0; i--){
                    j = i;

                    //�ų�1 5 9 13
                    while(j % 4 != 3){
                        this.merge(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        this.randomTile();
    },
    //�ϲ�
    merge: function(prevTile, currTile){
        //getAttribute() ��������ָ��������������ֵ��
        //prevVal�洢len0-11��ֵ
        //currVal�洢len4-15��ֵ
        var prevVal = prevTile.getAttribute('val');//w 0-11��һ��ֵ����ʼ��ʼֵ��
        var currVal = currTile.getAttribute('val');//w 4-15���ֵ��������ֵ��
        if(currVal != 0){
            //���������ֵΪ0��ִ��Ϊ0�ϲ�
            if(prevVal == 0){
                this.setTileVal(prevTile, currVal);//��ʼֵΪcurrVal
                this.setTileVal(currTile, 0);//���ԭ����ֵcurrVal
            }
            //���������ֵΪ��ͬ��ִ����Ӻϲ�
            else if(prevVal == currVal){
                this.setTileVal(prevTile, prevVal * 2);//��ʼֵ*2
                this.setTileVal(currTile, 0);//���ԭ����ֵcurrVal
            }
        }
    },
    //ƽ�ȵ�����ֵ������ͬ����false
    equal: function(tile1, tile2){
        return tile1.getAttribute('val') == tile2.getAttribute('val');
    },
    //�趨ͨ�ص�����
    max: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 2048){
                return true;
            }
        }
    },
    //��������
    over: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            //�ж������ֵ�Ƿ���Ϊ0��
            if(this.tiles[i].getAttribute('val') == 0){
                return false;
            }
            //3 7 11 15
            //�ж�ǰһ��ֵ�����ں�һ��ֵ�Ƿ���ͬ
            if(i % 4 != 3){
                if(this.equal(this.tiles[i], this.tiles[i + 1])){
                    return false;
                }
            }
            //�ж���һ��ֵ��������һ��ֵ�Ƿ���ͬ
            if(i < 12){
                if(this.equal(this.tiles[i], this.tiles[i + 4])){
                    return false;
                }
            }
        }
        return true;
    },
    //������Ϸ
    clean: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            this.container.removeChild(this.tiles[i]);
        }
        this.tiles = new Array(16);
    }
};

var game, startBtn;

window.onload = function(){
    var container = document.getElementById('div2048');
    startBtn = document.getElementById('start');
    startBtn.onclick = function(){
        this.style.display = 'none';
        game = game || new Game2048(container);
        game.init();
    }
};

//�����¼�����
window.onkeydown = function(e){
    var keynum, keychar;
    //���������
    //��������죺Internet Explorer ʹ�� event.keyCode ȡ�ر����µ��ַ���
    //�� Netscape/Firefox/Opera ʹ�� event.which��
    if(window.event){       // IE
        keynum = e.keyCode;
    }
    else if(e.which){       // Netscape/Firefox/Opera
        keynum = e.which;
    }
    //fromCharCode() �ɽ���һ��ָ���� Unicode ֵ��Ȼ�󷵻�һ���ַ�����
    keychar = String.fromCharCode(keynum);

    //indexOf(keychar) > -1 ����������������ַ������Ե�Ч�������Է������ַ������벻����Ӧ
    if(['W', 'S', 'A', 'D'].indexOf(keychar) > -1){
        if(game.over()){
            //���
            game.clean();
            startBtn.style.display = 'block';
            //��ʾ���¿�ʼ
            startBtn.innerHTML = 'game over, replay?';
            return;
        }
        //���̿����ƶ�
        game.move(keychar);
    }

};