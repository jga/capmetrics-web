import transitServiceColors from 'capmetrics-web/utils/service-colors';

export default function(datum) {
  for (let i = 0; i < datum.length; i++) {
    let data = datum[i];
    let color = 'purple';
    if (transitServiceColors.hasOwnProperty(data.key)) {
      color = transitServiceColors[data.key];
    }
    data.color = color;
  }
  return datum;
}

