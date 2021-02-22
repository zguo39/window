document.addEventListener('DOMContentLoaded', () => {
	let folderlist = document.querySelector(".folderlist")
	let xhr = new XMLHttpRequest
	xhr.open('GET', 'naruto.json')
	xhr.onreadystatechange = function () {
		if(xhr.status >= '200' && xhr.status < '400' && xhr.readyState == '4') {
			operate(JSON.parse(xhr.responseText))
		}
	}
	xhr.send()
	// operate(narutodata)
})

function operate(data) {
	let result = bindhtml(data)
	let list = document.querySelector('.ztree')
	list.innerHTML = result
	
	let scroll = document.querySelector('.folder')
	let product = new BScroll(scroll, {
		click: true,
		mouseWheel: true,
	})
	
	list.onclick = function (e) {
		if(['LI', 'A'].includes(e.target.tagName)) {
			let item = e.target.children[2] || e.target?.nextSibling?.nextSibling
			let trangle = e.target.children[3] || e.target.nextSibling?.nextSibling?.nextSibling?.nextSibling
			let pic = e.target?.previousSibling?.previousSibling
			if(item && item.style && item.style.display == 'block') {
				item.style.display = 'none'
				if(trangle) {
					trangle.style.transform = 'rotate(360deg)'
				}
				if(pic && pic.tagName == 'SPAN') {
					pic.classList.add('icon-wenjian')
					pic.classList.remove('icon-dakaidewenjianjia')	
				}
			}else if(item && item.style){
				item.style.display = 'block'
				if(trangle) {
					trangle.style.transform = 'rotate(180deg)'
				}
				if(pic && pic.tagName == 'SPAN') {
					pic.classList.remove('icon-wenjian')
					pic.classList.add('icon-dakaidewenjianjia')
				}
			}
		}
		product.refresh()
	}
}

function bindhtml(data) {
	let str = ""
	data.forEach((item) => {
		str += `<li>
					<span class="iconfont icon-wenjian" style="font-size: 30px; color: #FFCD2C;"></span>
					<a href="#">${item.name}</a>
					${item.children && item.children.length > 0 ? `
						<ul style="display: none">
							${bindhtml(item.children)}
						</ul>
						<div class="foldertrangle"></div>
					` : ""}
				</li>`
	})
	return str
}