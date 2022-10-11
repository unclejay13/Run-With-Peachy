kaboom({
    global: true,
    fullscreen: true,
    scale: 1.5,
    debug: true,
    clearColor: [0,0.5,0.5,3]
})

const MOVE_SPEED = 150
const JUMP_FORCE = 350
const BIG_JUMP_FORCE = 530
let CURRENT_JUMP_FORCE = JUMP_FORCE
let isJumping = true
const FALL_DEATH = 400
const FALL_PIPE = 500


loadRoot('https://i.imgur.com/')
loadSprite('peach','yHJiRR9.png')
loadSprite('coin','XpS9EuG.png')
loadSprite('brick','aMSimmZ.png')
loadSprite('brick2','jQobUgg.png')
loadSprite('brick3','NIqew7L.png')
loadSprite('brick4','BsXlb9F.png')
loadSprite('evil-orange','LiGAezm.png')
loadSprite('leaf','dE8jMMN.png')
loadSprite('surprise','GqiZECk.png')
loadSprite('surprise2','SJ3VbnY.png')
loadSprite('surprise3','JpCByhd.png')
loadSprite('unboxed','xuvmvN5.png')
loadSprite('unboxed2','nMBgK6Y.png')
loadSprite('unboxed3','5km4UxF.png')
loadSprite('pipe','rl3cTER.png')
loadSprite('pipe2','DJE93Ro.png')
loadSprite('block','9T64q6R.png')

scene("game", ({ level, score }) => {
    layers(['bg', 'obj', 'uni'],'obj')


    const maps = [
        [        
        '                                                ',
        '                                                ',
        '                                                ',
        '                                                ',
        '                                                ',
        '    $ =*=%        %=                            ',
        '                                                ',
        '                               $  =%%=          ',
        '                ^   ^                           ',
        '                                                ',
        '=======================                    @    ',
        '                                                ',
        '                           =====================',],
        [
        'c                                    @         c',
        'c                                              c',
        'c                                   ---        c',
        'c                        $$                    c',
        'c                                              c',
        'c                      ----                    c',
        'c                                              c',
        'c       -1+                   $                c',
        'c                             -+               c',
        'c                      xx                      c',
        'c         ^  ^       xxxx              xx      c',
        'c                  xxxxxx         $$   xx  $   c',
        '------------------------------------------------',
        ],
        [
        '                                                ',
        '                 a                              ',
        '                                                ',
        '               ///00/                           ',
        '                                    2/          ',
        '        $$                  //                  ',
        '                   $                            ',
        '                                    /     ////  ',
        '       ///     /////////     0/        $        ',
        '             //          $                  /   ',
        ' $                                    //     /  ',
        '   //      /           ///  //      /////////   ',
        '/////     ///         ///          ////    //   ',
        ]
    ] 

 

    const levelCfg = {
        width: 20,
        height: 20,
        '=': [sprite('brick'), solid(), scale(1.25)],
        'c': [sprite('brick2'), solid(), scale(1.25)],
        '/': [sprite('brick3'), solid(), scale(1.25)],
        '-': [sprite('brick4'), solid(), scale(1.25)],
        '$': [sprite('coin'), 'coin'],
        '%': [sprite('surprise'), solid(), 'coin-surprise', scale(1.25)],
        '+': [sprite('surprise2'), solid(), 'coin-surprise2', scale(1.25)],
        '0': [sprite('surprise3'), solid(), 'coin-surprise3', scale(1.25)],
        '*': [sprite('surprise'), solid(), 'leaf-surprise', scale(1.25)],
        '1': [sprite('surprise2'), solid(), 'leaf-surprise2', scale(1.25)],
        '2': [sprite('surprise3'), solid(), 'leaf-surprise3', scale(1.25)],
        '@': [sprite('pipe'), solid(), scale(1), 'pipe'],
        'a': [sprite('pipe2'), solid(), scale(1), 'pipe'],
        '^': [sprite('evil-orange'), solid(), scale(1.2), 'dangerous'],
        '#': [sprite('leaf'), solid(), 'leaf', body()],
        '&': [sprite('unboxed'), solid(), scale(1.25)],
        '!': [sprite('unboxed2'), solid(), scale(1.25)],
        '?': [sprite('unboxed3'), solid(), scale(1.25)],
        'x': [sprite('block'), solid(), scale(1.25)],
  
    }

    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([
        text(score),
        pos(30,6),
        layer('ui'),
        {
            value: score,
        }
    ])

    const instruction = add([
        text('press key up, right, left to play'),
        pos(30,20),
        layer('ui'),
        {
            value: 'instruction',
        },
    ])

    const instruction2 = add([
        text('press key down at the pipe to go to the next level'),
        pos(530,90),
        layer('ui'),
        {
            value: 'instruction',
        }
    ])

    const instruction3 = add([
        text('**jump on the evil orange to kill them'),
        pos(80,50),
        layer('ui'),
        {
            value: 'instruction',
        }
    ])

    add([text('level'+ parseInt(level + 1)), pos(60,6)])

    function big() {
        let timer = 0 
        let isBig = false
        return {
            update() {
                if (isBig) {
                
                  timer -=dt()
                    if (timer <= 0) {
                        this.smallify()
                    }
                }
            },
            isBig() {
                return isBig
            },
            biggify() {
                this.scale = vec2(2)
                CURRENT_JUMP_FORCE = BIG_JUMP_FORCE   
                timer = time
                isBig = true
            },
            smallify() {
                this.scale = vec2(1)
                CURRENT_JUMP_FORCE = JUMP_FORCE
                timer = 0
                isBig = false
            }
        }
        
    }

    const player = add([
        sprite('peach'), solid(), pos(60,0),
        body(), origin('bot'), big()
    ])

    action('leaf', (m) => {
        m.move(50, 0)
    })

    player.on("headbump", (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('&', obj.gridPos.sub(0,0))
        }
        if (obj.is('leaf-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj) 
            gameLevel.spawn('&', obj.gridPos.sub(0,0))
        }
        if (obj.is('coin-surprise2')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('!', obj.gridPos.sub(0,0))
        }
        if (obj.is('leaf-surprise2')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj) 
            gameLevel.spawn('!', obj.gridPos.sub(0,0))
        }
        if (obj.is('coin-surprise3')) {
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('?', obj.gridPos.sub(0,0))
        }
        if (obj.is('leaf-surprise3')) {
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj) 
            gameLevel.spawn('?', obj.gridPos.sub(0,0))
        }
    })

    player.collides('leaf', (m) => {
        player.biggify(4)
        destroy(m)
    })

    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })

    const ENEMY_SPEED = 15
    
    action('dangerous', (d) => {
    d.move(-ENEMY_SPEED,0)
    })

    player.collides('dangerous', (d) => {
        if(isJumping) {
            destroy(d) 
        } else {
            go('lose', {score: scoreLabel.value})
        }
    })

    player.action(() => {
        camPos(player.pos)
        if (player.pos.y >= FALL_DEATH) {
            go('lose', {score: scoreLabel.value})
        }
    })


    player.collides('pipe', () => {
        keyPress('down', () => {
            player.smallify(4)
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value
            })
        })
    })

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
    })

    player.action(() => {
        if(player.grounded()) {
            isJumping = false
        }
    })

    keyPress('up', () => {
        if (player.grounded()) {
            isJumping = true
            player.jump(CURRENT_JUMP_FORCE)
        }
    })
})

scene('lose', ({score}) => {
    add([text(score,32), origin('center'), pos(width()/2, height()/2)])
}) 

start("game", {level: 0, score: 0})
