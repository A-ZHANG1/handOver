var traceList = []
var geneList = []
var distanceTable = []
var bestGene = null

const SAMPLE_NUM = 10

function traceRecommendTest() {
  traceList.push({ lat: 0, lon: 0 })
  traceList.push({ lat: 1, lon: 0 })
  traceList.push({ lat: 3, lon: 0 })
  traceList.push({ lat: 4.5, lon: 2 })
  traceList.push({ lat: 6, lon: 4 })
  traceList.push({ lat: 6, lon: 5 })
  traceList.push({ lat: 6, lon: 6 })
  traceList.push({ lat: 6, lon: 8 })
  for (let i = 0; i < traceList.length; i++) {
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
  return oTempGenen
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

  return
}
function removeBadGenes() {
  return
}
function getBestGene() {
  return
}
function chechEndCondition() {
  return
}
function natureSelect() {
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
  for(var i = 0; chechEndCondition(); i++) {
    natureSelect()
    hybridize()
    variate()
    calculateFitness()
    let lastBestGene = bestGene
    bestGene = getBestGene()
  }
  return bestGene
}

