let divmap = {}
let allbox
let allboxarr = []
let box1
let box2

document.addEventListener('DOMContentLoaded', () => {
	let menu = document.querySelector(".menu")
	
	menu.onmouseenter = () => {
		setTimeout(() => {
			menu.classList.add('menuafter')
		}, 650)
	}
	menu.onmouseleave = () => {
		menu.classList.remove('menuafter')
	}
	// name div监听事件
	let explore = document.querySelector('.explore')
	let matrix_explore = [[1,1,0],
						  [0,1,0],
						  [0,0,1],
						  [0,0,0],
						  [0,0,0]]
	box1 = new picbox(explore, matrix_explore, 327)
	let play = document.querySelector('.play')
	let matrix_play = [[1,1,1],
					   [0,0,0],
					   [0,0,0],
					   [0,0,0],
					   [0,0,0]]
	box2 = new picbox(play, matrix_play, 645)
	
	allboxarr.forEach(item => {
		switch(item.div.className) {
			case "milan hov":
				item.position = [0,0]
				break;
			case "office hov":
				item.position = [0,1]
				break;
			case "huatu hov":
				item.position = [1,1]
				break;
			case "Fill hov":
				item.position = [2,2]
				break;
			case "chrome hov":
				item.position = [0,0]
				break;
			case "edge hov":
				item.position = [0,1]
				break;
			case "audio hov":
				item.position = [0,2]
				break;
		}
	})
})

class picbox {
	constructor(out, matrix, bound) {
		this.div = out
		this.matrix = matrix
		this.bound = bound
		
		// this.picLeft = out.getBoundingClientRect().left
		// this.picTop = out.getBoundingClientRect().top
		
	    let x = out.querySelector('.icon-chaguanbi')
	    let equal = out.querySelector('.icon-dengyu')
	    let name = out.querySelector('.name')
	    let inp = out.querySelector('.inp')
		let hov = [...out.getElementsByClassName('hov')]
		
		hov.forEach(item => {
			allboxarr.push(new innerbox(item, item.offsetLeft-6, item.offsetTop-6, item.offsetWidth,
				item.getBoundingClientRect().left,
				item.getBoundingClientRect().top,
				this
			))
		})
		
	    name.onmouseenter = () => {
	    	equal.style.display = "block"
	    }
	    name.onmouseleave = () => {
			if(name.style.backgroundColor == "transparent" || !name.style.backgroundColor){
				equal.style.display = "none"
			}
	    }
		
		inp.onfocus = () => {
			name.style.backgroundColor = "red"
			equal.style.display = "block"
			x.style.display = "block"
			x.style.color = "black"
		}
		
		let ob = () => {
			name.style.backgroundColor = "transparent"
			equal.style.display = "none"
			x.style.color = "transparent"
			x.style.display = "none"
			inp.value == "" ? inp.value = "命名组" : null 
		}
		
		inp.onblur = ob
		
		x.addEventListener('mousedown', (event) => {
			event.preventDefault()
			inp.value = ""
		}, true)
		
		equal.onmousedown = (event) => {
			inp.onblur = null
			event.preventDefault()
			inp.blur()
			x.style.color = "transparent"
			x.style.display = "none"
			name.style.backgroundColor = 'red'
			inp.onblur = ob
			out.style.height = '46px'
			let init = {
				ix: event.pageX,
				iy: event.pageY
			}
			// document.onmousemove = (e) => {
			// 	out.classList.add('bigboxtran')
			// 	let obj = {
			// 		x: e.pageX,
			// 		y: e.pageY
			// 	}
			// 	equalmove(obj,init,this)
			// }
		}
		
		equal.onmouseup = (e) => {
			name.style.backgroundColor = "transparent"
			equal.style.display = "none"
			inp.value == "" ? inp.value = "命名组" : null,
			out.style.height = '550px'
			document.onmousemove = null
			out.classList.remove('bigboxtran')
		}
		
		hov.forEach(item => {
			item.onmousedown = (e) => {
				e.preventDefault()
				let flag = false
				let picLeft = item.parentNode.parentNode.getBoundingClientRect().left
				let picTop = item.parentNode.parentNode.getBoundingClientRect().top
				item.initLeft = e.pageX - item.getBoundingClientRect().left + picLeft
				item.initTop = e.pageY - item.getBoundingClientRect().top + picTop
				item.parentNode.parentNode.style.overflow = 'visible'
				
				
				document.onmousemove = (event) => {
					if(!flag) {
						allboxarr.filter(d => d.div !== item).forEach(d => {
							d.div.classList.add('sboxscale')
						})
						flag = true
					}
					moveSmallBox(event, item)
				}
			}
			item.onmouseup = () => {
				let box
				document.onmousemove = null
				item.style.zIndex = 3
				box = showdowremove(item)
				magnet(box)
				matrixfix(box)
				rerender(box)
				out.style.overflow = 'hidden'
				console.log(box)
			}
		})
	}
}

class innerbox {
	constructor(div, x, y, w, l, t, p) {
		this.div = div
	    this.left = x
		this.top = y
		this.w = w
		this.clientLeft = l
		this.clientTop = t
		this.isCollision = false
		this.obser = []
		this.parent = p

		this.position = []
	}
	update() {
		this.isCollision = false
		let obj = this['div'].getBoundingClientRect()
		this.clientLeft = obj.left
		this.clientTop = obj.top
		
		let style = this['div'].style
		this.left = numconvert(style.left) || this.left
		this.top = numconvert(style.top) || this.top
	}
	back() {
		this.isCollision = false
		this.div.style.left = this.left + 'px'
		this.div.style.top = this.top + 'px'
		this.parent.matrix[this.position[0]][this.position[1]] = 1
		this.parent.matrix[this.temp[0]][this.temp[1]] = 0
		this.temp = []
	}
}


function moveSmallBox(event, div) {
	let clientx = event.pageX
	let clienty = event.pageY
	let disLeft = div.initLeft
	let disTop = div.initTop
	let rect = div.getBoundingClientRect()
	let width = rect.width
	let dsl = rect.left
	let dst = rect.top
	div.style.zIndex = 10
	// 当前box随鼠标移动而移动
	div.style.left = `${clientx - disLeft - 6}px`
	div.style.top = `${clienty - disTop - 6}px`

	collision(width, dsl, dst, div)
}

// 移动碰撞检测
function collision(w, x, y, div) {
	let i = 0,
		box
	let arr = allboxarr.filter(d => {
			if(d['div'] !== div) {
				return true
			}
			else {
				box = d
				return false
			}
			// return d['div'] !== div ? true : (box = d; )
		})
	// box.parent.matrix[box.position[0]][box.position[1]] = 0
	// 遍历所有节点对象，判断碰撞，并且移动
	for (; i < arr.length; i++){
		let item = arr[i]
		// 四个边碰撞条件
		if(!item.isCollision && ifcheck(item, {x , y, w}))
		{

			item.isCollision = true
			let matrix = item.parent.matrix
			let x = item.position[0]
			let y = item.position[1]
			// matrix[x][y] = 0
			// console.log(matrix)
			if(matrix[x - 1] && matrix[x - 1][y] == 0){
				item.div.style.top = item.top - 101 + 'px'
				item.div.style.left = item.left + 'px'
				matrix[x - 1][y] = 1
				item['temp'] = [x - 1, y]
				box.obser.push(item)
			}
			else if(matrix[x][y + 1] == 0){
				item.div.style.left = item.left + 101 + 'px'
				item.div.style.top = item.top + 'px'
				matrix[x][y + 1] = 1
				item['temp'] = [x, y + 1]
				box.obser.push(item)
			}
			else if(matrix[x][y - 1] == 0){
				item.div.style.left = item.left - 101 + 'px'
				item.div.style.top = item.top + 'px'
				matrix[x][y - 1] = 1
				item['temp'] = [x, y - 1]
				box.obser.push(item)
			}
			else if (matrix[x + 1][y] == 0){
				item.div.style.top = item.top + 101 + 'px'
				item.div.style.left = item.left + 'px'
				matrix[x + 1][y] = 1
				item['temp'] = [x + 1, y]
				box.obser.push(item)
			}
		}
		
		if(box.obser.length){
			for(let i = 0; i < box.obser.length; i++) {
				let item = box.obser[i]
				if(isleave(item, {x, y, w})){
					console.log('back')
					item.back()
					box.obser.splice(i, 1)
					i--
				}
			}
		}
		
	}
}

function rerender(box) {
	box.update()
}

function ifcheck(item, {x, y, w}) {
	if(item.clientLeft + item.w > x &&
			item.clientLeft < x + w &&
			((item.clientTop < y && 
			item.clientTop + 95 > y ) ||
			(y + 95 > item.clientTop && y < item.clientTop))){
				return true
			}
	return false
}

function isleave(item, {x, y, w}) {
	if(item.clientLeft > x + w || item.clientLeft + item.w < x
		|| item.clientTop > y + 95 || item.clientTop + 95 < y
	){
		return true
	}
	return false
}

function numconvert(str) {
	return parseInt(str)
}

function showdowremove(item) {
	let box
	allboxarr.forEach(d => {
		if(item == d.div){
			box = d
		}
		d.div.classList.remove('sboxscale')
	})
	return box
}

function matrixfix(box) {
	box.obser.forEach(son => {
		// son.parent.matrix[son.position[0]][son.position[1]] = 0
		// son.position[0] = son.temp[0]
		// son.position[1] = son.temp[1]
		son.back()
		son.temp = []
		son.update()
	})
	box.obser = []
}

function magnet(box) {
	let style = box.div.style
	let check = numconvert(style.left) + numconvert(style.top)
	let target
	let sum = 0
	if(box.obser.length) {
		box.obser.forEach(item => {
			let tempsum = item.left + item.top
			if(Math.abs(tempsum - check) > sum) {
				target = item
			}
		})
		box.obser = box.obser.filter(b => b !== target)
		box.parent.matrix[box.position[0]][box.position[1]] = 0
		box.position[0] = target.position[0]
		box.position[1] = target.position[1]
		target.position[0] = target.temp[0]
		target.position[1] = target.temp[1]
		target.parent.matrix[target.position[0]][target.position[1]] = 1
		target.temp = []
		if(box.parent !== target.parent) {
			box.parent = target.parent
			box.div.remove(box.div)
			box.parent.div.children[1].append(box.div)
		}
		box.div.style.left = target.left + 'px'
		box.div.style.top = target.top + 'px'
		box.left = target.left
		box.top = target.top
		target.update()
		// box.update()
	}
	else {
		let obj = box['div'].getBoundingClientRect()
		let cl = obj.left
		let ct = obj.top
		if(cl < box.parent.bound - 40 || cl > box.parent.bound + 263) {
			box.parent = box.parent == box1 ? box2 : box1,
			box.div.remove(box.div)
			box.parent.div.children[1].append(box.div)
		}
		let col = Math.round(Math.abs(cl - box.parent.bound)/101)
		let cot = Math.round((ct - 51)/101)
		box.div.style.left = col * 101 + 'px'
		box.left = col * 101
		box.div.style.top = cot * 101 + 40 + 'px'
		box.top = cot * 101
		box.parent.matrix[cot][col] = 1
		box.position = [cot,col]
		box.update()
		console.log(box)
	}
}

function equalmove({x,y},{ix,iy},bigbox) {
	bigbox.div.style.left = x - ix + 'px'
	bigbox.div.style.top = y - iy + 'px'
	
}


// 节流
// function throttle(fn) {
// 	let timer = null
// 	let previous = 0
// 	return function () {
// 		let now = new Date() - previous
// 		if(now >= 500 && timer == null){
// 			fn()
// 			previous = new Date()
// 		}
// 		else if(timer == null){
// 			timer = setTimeout(() => {
// 				fn()
// 				previous = new Date()
// 				clearTimeout(timer)
// 				timer = null
// 			}, 500 - now)
// 		}
// 	}
// }