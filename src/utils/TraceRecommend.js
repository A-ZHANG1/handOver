var traceList = []
var geneList = []
var distanceTable = []
var bestGene = null
var startPoint = null
var startPointDistance = []
var endPoint = null
var endPointDistance = []

const SAMPLE_NUM = 1000
const SAMPLE_DEL = 0.5
const SAMPLE_SAVE = 0.1
const HYBRID_SIZE = 200
const VARIATE_SIZE = 200
const ITERATION_MAX = 20
const BESTKEEPS_MAX = 10

function traceRecommendTest() {
  startPoint = { lat: -1, lon: 0 }
  endPoint = { lat: 6, lon: 9 }
  traceList.push({ lat: 0, lon: 0 })
  traceList.push({ lat: 0.5, lon: 0 })
  traceList.push({ lat: 1, lon: 0 })
  traceList.push({ lat: 1.5, lon: 0 })
  traceList.push({ lat: 2, lon: 0 })
  traceList.push({ lat: 2.5, lon: 0 })
  traceList.push({ lat: 3, lon: 0 })
  traceList.push({ lat: 3.75, lon: 1 })
  traceList.push({ lat: 4.5, lon: 2 })
  traceList.push({ lat: 5.25, lon: 3 })
  traceList.push({ lat: 6, lon: 4 })
  traceList.push({ lat: 6, lon: 4.5 })
  traceList.push({ lat: 6, lon: 5 })
  traceList.push({ lat: 6, lon: 5.5 })
  traceList.push({ lat: 6, lon: 6 })
  traceList.push({ lat: 6, lon: 6.5 })
  traceList.push({ lat: 6, lon: 7 })
  traceList.push({ lat: 6, lon: 7.5 })
  traceList.push({ lat: 6, lon: 8 })
  traceList.push({ lat: 6, lon: 8.5 })
  for (let i = 0; i < traceList.length; i++) {
    if (startPoint) {
      startPointDistance.push(Math.sqrt(Math.pow(traceList[i].lat - startPoint.lat, 2) + Math.pow(traceList[i].lon - startPoint.lon, 2)))
    }
    if (endPoint) {
      endPointDistance.push(Math.sqrt(Math.pow(traceList[i].lat - endPoint.lat, 2) + Math.pow(traceList[i].lon - endPoint.lon, 2)))
    }
    distanceTable.push([])
    for (let j = 0; j < traceList.length; j++) {
      distanceTable[i][j] = Math.sqrt(Math.pow(traceList[i].lat - traceList[j].lat, 2) + Math.pow(traceList[i].lon - traceList[j].lon, 2))
    }
  }
}

function getGene() {
  const oTempGenen = new Object
  oTempGenen.trace = []
  oTempGenen.fitness = 0
  oTempGenen.propertion = 0
  return oTempGenen
}

function geneEqual(a, b) {
  if (!a || !b) return false
  if (!a.trace || !b.trace) return false
  if (a.trace.length !== b.trace.length) return false
  for (let i = 0; i < a.trace.length; i++) {
    if (a.trace[i] !== b.trace[i]) return false
  }
  return true
}

function initializeGeneList() {
  for (let i = 0; i < SAMPLE_NUM; i++) {
    const tempTraceList = []
    for (let j = 0; j < traceList.length; j++) {
      tempTraceList.push(j)
    }
    const gene = getGene()
    for (let j = 0; j < traceList.length; j++) {
      const pos = Math.floor(Math.random() * tempTraceList.length)
      gene.trace.push(tempTraceList[pos])
      tempTraceList.splice(pos, 1)
    }
    geneList.push(gene)
  }
  return
}

function calculateFitness() {
  geneList.forEach(function(gene) {
    gene.fitness = 0.0
    if (startPoint) {
      gene.fitness += startPointDistance[gene.trace[0]]
    }
    for (let i = 1; i < gene.trace.length; i++) {
      gene.fitness += distanceTable[gene.trace[i - 1]][gene.trace[i]]
    }
    if (endPoint) {
      gene.fitness += endPointDistance[gene.trace[gene.trace.length - 1]]
    }
    gene.propertion = 1.0 / (gene.fitness + 0.1)
  })
  return
}

function removeBadGenes() {
  geneList.sort(function(a, b) {
    for (let i = 0; i < a.trace.length; i++) {
      if (a.trace[i] !== b.trace[i]) return a.trace[i] - b.trace[i]
    }
    return 0
  })
  // 去重
  for (let i = geneList.length - 1; i > 0; i--) {
    if (geneEqual(geneList[i], geneList[i - 1])) {
      geneList.splice(i, 1)
    }
  }
  // 随机删除部分数据
  const sampleSave = Math.floor(SAMPLE_SAVE * geneList.length)
  for (let i = geneList.length - 1; i > sampleSave; i--) {
    if (Math.random() < SAMPLE_DEL) {
      geneList.splice(i, 1)
    }
  }
  return
}

function getBestGene() {
  geneList.sort(function(a, b) {
    return a.fitness - b.fitness
  })
  if (bestGene && bestGene.fitness < geneList[0].fitness) return bestGene
  return JSON.parse(JSON.stringify(geneList[0]))
}

function checkEndCondition() {
  return false
}

function natureSelect() {
  const propertionList = [0]
  geneList.forEach(function(gene) {
    propertionList.push(propertionList[propertionList.length - 1] + gene.propertion)
  })
  const proportionSum = propertionList[propertionList.length - 1]
  const newGeneList = []
  for (let i = 0; i < SAMPLE_NUM; i++) {
    const posD = Math.random() * proportionSum
    let posI = 0
    for (let j = 1; j < propertionList.length - 1; j++) {
      if (propertionList[j] > posD) break
      posI++
    }
    newGeneList.push(JSON.parse(JSON.stringify(geneList[posI])))
  }
  geneList = newGeneList
  return
}

function fixGene(gene, start, size) {
  const appearFlags = []
  const doubleFlags = []
  const candidateList = []
  for (let i = 0; i < gene.trace.length; i++) {
    appearFlags.push(false)
    doubleFlags.push(false)
  }
  for (let i = 0; i < gene.trace.length; i++) {
    if (appearFlags[gene.trace[i]]) doubleFlags[gene.trace[i]] = true
    appearFlags[gene.trace[i]] = true
  }
  for (let i = 0; i < appearFlags.length; i++) {
    if (!appearFlags[i]) candidateList.push(i)
  }
  for (let i = 0; i < gene.trace.length; i++) {
    if (doubleFlags[gene.trace[i]] && (i < start || i >= start + size)) {
      const pos = Math.floor(Math.random() * candidateList.length)
      gene.trace[i] = candidateList[pos]
      candidateList.splice(pos, 1)
    }
  }
}

function hybridize() {
  const size = geneList.length
  if (size === 0) return
  const length = geneList[0].trace.length
  for (let i = 0; i < HYBRID_SIZE; i++) {
    const posA = Math.floor(Math.random() * size)
    let posB = Math.floor(Math.random() * size)
    posB = (posA === posB) ? (posB + 1) % size : posB
    const geneA = geneList[posA]
    const geneB = geneList[posB]
    let hybridizeSize = Math.floor(Math.random() * length * 0.5 + 1)
    hybridizeSize = Math.max(1, Math.min(hybridizeSize, length / 2))
    const hybridizePos = Math.floor(Math.random() * (length - hybridizeSize + 1))
    for (let j = 0; j < hybridizeSize; j++) {
      const p = hybridizePos + j
      if (p < length) {
        const temp = geneA.trace[p]
        geneA.trace[p] = geneB.trace[p]
        geneB.trace[p] = temp
      }
    }
    fixGene(geneA, hybridizePos, hybridizeSize)
    fixGene(geneB, hybridizePos, hybridizeSize)
  }
  return
}

function variate() {
  const size = geneList.length
  if (size === 0) return
  const length = geneList[0].trace.length
  for (let i = 0; i < VARIATE_SIZE; i++) {
    const pos = Math.floor(Math.random() * size)
    const pA = Math.floor(Math.random() * length)
    let pB = Math.floor(Math.random() * length)
    pB = (pA === pB) ? (pB + 1) % length : pB
    const temp = geneList[pos].trace[pA]
    geneList[pos].trace[pA] = geneList[pos].trace[pB]
    geneList[pos].trace[pB] = temp
  }
  return
}

export function traceRecommend() {
  initializeGeneList()
  calculateFitness()
  removeBadGenes()
  bestGene = getBestGene()
  for (let i = 0, bestKeeps = 0; i < ITERATION_MAX || bestKeeps < BESTKEEPS_MAX || checkEndCondition(); i++) {
    natureSelect()
    hybridize()
    variate()
    calculateFitness()
    removeBadGenes()
    const lastBestGene = bestGene
    bestGene = getBestGene()
    if (geneEqual(bestGene, lastBestGene)) bestKeeps++
    else bestKeeps = 0
  }
  return bestGene
}

