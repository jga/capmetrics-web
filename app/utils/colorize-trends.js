let transitServiceColor = {
  'CORE - METRORAIL': 'red',
  'CORE - METRORAPID': '#f24d6e',
  'CORE - LIMITED': '#649dce',
  'CORE - RADIAL': '#5190c8',
  'CORE - FEEDER': '#3d84c2',
  'CORE - EXPRESS/FLYERS': '#3777ae',
  'CORE - CROSSTOWN': '#77a9d4',
  'SPECIAL - REVERSE COMMUTE': '#6c9452',
  'SPECIAL - RAIL CONNECTORS': '#4b874b',
  'SPECIAL - EBUS': '#42775b',
  'SPECIAL - NIGHT OWLS': '#7ec87e',
  'SPECIAL - SENIOR': '#70b18e',
  'UT - CIRCULATORS': '#ffbb4f',
  'UT - RADIALS': '#af823c'
}

export default function(datum) {
  for (let i = 0; i < datum.length; i++) {
    let data = datum[i];
    let color = 'purple';
    if (transitServiceColor.hasOwnProperty(data.key)) {
      color = transitServiceColor[data.key];
    }
    data.color = color;
  }
  return datum;
}

