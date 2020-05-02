console.log('LOADED!')
contentsDiv = $('#articleBodyContents')

let nodes = $('#articleBodyContents').contents()
console.log('nodes: %O', nodes)

// #text, #comment, SCRIPT, BR, SPAN, 
let sourceText = ''
let passedJs = false
nodes.each(function(i) {
    //console.log(this)
    console.log(`[${i}] ${this.nodeName}`)
    console.log(`[${i}] ${this.data}`)

    if (this.nodeName === 'SCRIPT') {
        passedJs = true
    }

    if (passedJs && this.nodeName === '#text') {
        sourceText += this.data + '\n'
    }
})

console.log(sourceText)

const toFullWidth = function(str) {
    str = str.replace(/[A-Z0-9]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);});

    str = str.replace(/\(/g, '\uFF08')
    str = str.replace(/\)/g, '\uFF09')

    str = str.replace(/\[/g, '\uFF3B')
    str = str.replace(/\]/g, '\uFF3D')

    str = str.replace(/\./g, '\u3002')
    str = str.replace( /,/g, '\uFF0C')

    return str
}

//let sourceText =
//`[헤럴드경제=강문규 기자]북한 관영 매체가 김정은 북한 국무위원장의 공개활동을 보도했다. ‘사망설’까지 불거졌던 신변이상설이 전세계적으로 확산된 가운데 나온 보도다.
//조선중앙방송은 2일 김 위원장이 노동절(5·1절)이었던 전날 평안남도 순천인비료공장 준공식에 참석했다고 밝혔다. 이는 지난달 11일 평양의 노동당 중앙위원회 본부청사에서 당 정치국 회의를 주재한 이후 처음으로 20일만의 공개행보다. 김 위원장은 특히 지난달 15일 집권 이후 처음으로 김일성 주석의 생일에 금수산태양궁전을 참배하지 않으면서 각종 신변 이상설에 휩싸였다. `

contentsDiv.css('display','block')
contentsDiv.css('font-family','serif')
contentsDiv.css('column-width', '13em')
contentsDiv.css('column-fill', 'auto')
contentsDiv.css('writing-mode', 'vertical-rl')
contentsDiv.css('width', '100%')
contentsDiv.css('height', 'max-content')
contentsDiv.css('text-align', 'justify')
contentsDiv.empty()

// deal with digraph tate-chu-yoko.
let tokens = []
const candidatesRegexAZ = /([A-Z][A-Z]*[A-Z])|([0-9][0-9]*[0-9])/g
let i = 0
while ((match = candidatesRegexAZ.exec(sourceText)) != null) {
    if (match[0] && match[0].length === 2) {
        //console.log("** match found at " + match.index);
        let is = match.index
        let ie = match.index + match[0].length

        tokens.push(sourceText.substring(i, is))
        tokens.push({
            type: 'combine',
            html: `<span style="text-combine-upright:all;letter-spacing:normal;">${toFullWidth(match[0])}</span>`
        })
        i = ie
    }
}
tokens.push(sourceText.substring(i, sourceText.length))

console.log('tokens (pass 1): %O', tokens)

tokens = tokens.map(token => {
    if (typeof token !== 'string') {
        return token
    }

    let s = ''
    for (let i=0; i<token.length; ++i) {
        let char = token[i]
        s += toFullWidth(char)
    }

    return s
})

console.log('tokens (pass 2): %O', tokens)

sourceText = ''
tokens.forEach(token => {
    if (typeof token === 'string') {
        sourceText += token
    } else if (typeof token === 'object') {
        sourceText += token.html
    }
})

//sourceText = sourceText.replace(/\n/gi, '<br /><br />')
sourceText.split('\n').forEach(paragraph => {
    contentsDiv.append(`<p style="display:block;margin:0 0 27px 1em;line-height:1.4em;letter-spacing:0.066em;">${paragraph}</p>`)
})

