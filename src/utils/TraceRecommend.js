var traceList = []
var geneList = []
var distanceTable = []
var bestGene = null
var startPoint = null
var startPointDistance = []
var endPoint = null
var endPointDistance = []

const SAMPLE_NUM = 100

function traceRecommendTest() {
  startPoint = { lat: -1, lon: 0 }
  endPoint = { lat: 6, lon: 9 }
  traceList.push({ lat: 0, lon: 0 })
  traceList.push({ lat: 1, lon: 0 })
  traceList.push({ lat: 3, lon: 0 })
  traceList.push({ lat: 4.5, lon: 2 })
  traceList.push({ lat: 6, lon: 4 })
  traceList.push({ lat: 6, lon: 5 })
  traceList.push({ lat: 6, lon: 6 })
  traceList.push({ lat: 6, lon: 8 })
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
  for (let i = 1; i < SAMPLE_NUM; i++) {
    const tempTraceList = []
    for (let j = 1; j < traceList.length; j++) {
      tempTraceList.push(j)
    }
    const gene = getGene()
    for (let j = 1; j < traceList.length; j++) {
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
  return
}

function getBestGene() {
  geneList.sort(function(a, b) {
    return a.fitness - b.fitness
  })
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
function hybridize() {
  return
}
function variate() {
  return
}

export function traceRecommend() {
  initializeGeneList()
  calculateFitness()
  removeBadGenes()
  bestGene = getBestGene()
  for (var i = 0; checkEndCondition(); i++) {
    natureSelect()
    hybridize()
    variate()
    calculateFitness()
    let lastBestGene = bestGene
    bestGene = getBestGene()
  }
  return bestGene
}

