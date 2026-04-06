import { alabama } from './alabama'
import { alaska } from './alaska'
import { arizona } from './arizona'
import { arkansas } from './arkansas'
import { california } from './california'
import { colorado } from './colorado'
import { connecticut } from './connecticut'
import { delaware } from './delaware'
import { florida } from './florida'
import { georgia } from './georgia'
import { hawaii } from './hawaii'
import { idaho } from './idaho'
import { illinois } from './illinois'
import { indiana } from './indiana'
import { iowa } from './iowa'
import { kansas } from './kansas'
import { kentucky } from './kentucky'
import { louisiana } from './louisiana'
import { maine } from './maine'
import { maryland } from './maryland'
import { massachusetts } from './massachusetts'
import { michigan } from './michigan'
import { minnesota } from './minnesota'
import { mississippi } from './mississippi'
import { missouri } from './missouri'
import { montana } from './montana'
import { nebraska } from './nebraska'
import { nevada } from './nevada'
import { newhampshire } from './new-hampshire'
import { newjersey } from './new-jersey'
import { newmexico } from './new-mexico'
import { newyork } from './new-york'
import { northcarolina } from './north-carolina'
import { northdakota } from './north-dakota'
import { ohio } from './ohio'
import { oklahoma } from './oklahoma'
import { oregon } from './oregon'
import { pennsylvania } from './pennsylvania'
import { rhodeisland } from './rhode-island'
import { southcarolina } from './south-carolina'
import { southdakota } from './south-dakota'
import { tennessee } from './tennessee'
import { texas } from './texas'
import { utah } from './utah'
import { vermont } from './vermont'
import { virginia } from './virginia'
import { washington } from './washington'
import { westvirginia } from './west-virginia'
import { wisconsin } from './wisconsin'
import { wyoming } from './wyoming'

export const states = [
  alabama, alaska, arizona, arkansas, california, colorado,
  connecticut, delaware, florida, georgia, hawaii, idaho,
  illinois, indiana, iowa, kansas, kentucky, louisiana,
  maine, maryland, massachusetts, michigan, minnesota, mississippi,
  missouri, montana, nebraska, nevada, newhampshire, newjersey,
  newmexico, newyork, northcarolina, northdakota, ohio, oklahoma,
  oregon, pennsylvania, rhodeisland, southcarolina, southdakota,
  tennessee, texas, utah, vermont, virginia, washington,
  westvirginia, wisconsin, wyoming,
]

export const getStateBySlug = (slug: string) =>
  states.find((s) => s.slug === slug)

export const getStatesByStatus = (status: string) =>
  states.filter((s) => s.status === status)

export const getCompletedStates = () =>
  states.filter((s) => s.status !== 'pending')
