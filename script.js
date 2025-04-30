window.addEventListener('load', () => {
	unfoldPages ()
	numberPages ()
	amendJumps ()
})

function unfoldPages () {
	let pages = Array.from (document.querySelectorAll ('.page'))
	pages.map (splitPageContent)
}

function numberPages () {
	let pages = Array.from (document.querySelectorAll ('.page'))
	pages.map (numberPage)
}

function numberPage (el, ind) {
	el.setAttribute('page-num', ind + 1)
	Array.from (el.querySelectorAll ('.pageNumber')).map ((el) => el.innerHTML = ind + 1)
}

function splitPageContent (p) {
	let height = p.clientHeight
	if (p.scrollHeight > height) {
		const overCandidate = Array.from (p.children).findIndex ((el) => el.offsetTop + el.offsetHeight > height)
		if (overCandidate >= 0) {
			const over = Math.max (1, overCandidate)
			const el = document.createElement ('div')
			el.className = 'page'
			moveChildrenFromIndex (p, over, el)
			const footer = el.querySelector ('footer')
			if (footer) {
				const foot = footer.cloneNode (true)
				p.appendChild (foot)
			}
			p.after (el)
			splitPageContent (el)
		}
	}
}

function amendJumps () {
	let links = Array.from (document.querySelectorAll ('a[href]'))
	links.map (amendJump)
}

function amendJump (a) {
	const art = findTargetElementFromLinkWithURL (a)
	const aa = a . querySelector ('.a')
	if (art && aa) {
		const num = art . parentElement . getAttribute ('page-num')
		const mark = art . querySelector ('.step-marker') ?. innerHTML || ''
		aa.innerHTML = (num ? ' page ' + num : '') + (mark ? ' ' + mark : '')
	}
}

function findTargetElementFromLinkWithURL (linkElement) {
  const href = linkElement.getAttribute('href');
  try {
    const url = new URL(href, window.location.href); // Resolve relative URLs
    const hash = url.hash;
    if (hash) {
      const targetId = hash.substring(1);
      const targetElement = document.getElementById(targetId);
      return targetElement;
    }
  } catch (error) {
    // Handle invalid URL or other errors
    console.error("Error parsing URL:", error);
  }
  return null;
}

function moveChildrenFromIndex (sourceElement, startIndex, targetElement) {
  const childrenToMove = Array.prototype.slice.call (sourceElement.children, startIndex)
  targetElement.append (...childrenToMove)
}
