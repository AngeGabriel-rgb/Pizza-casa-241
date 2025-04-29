export const Chart = () => {
  return <div>Chart</div>
}

export const ChartContainer = ({ data, xAxis, yAxis, children }) => {
  return <div>{children}</div>
}

export const ChartTooltip = ({ content }) => {
  return <div>{content}</div>
}

export const ChartTooltipContent = ({ formatter }) => {
  return <div>Tooltip Content</div>
}

export const ChartLegend = () => {
  return <div>ChartLegend</div>
}

export const ChartLegendItem = () => {
  return <div>ChartLegendItem</div>
}

export const ChartGrid = ({ vertical }) => {
  return <div>ChartGrid</div>
}

export const ChartLine = ({ dataKey, stroke, strokeWidth }) => {
  return <div>ChartLine</div>
}

export const ChartArea = ({ dataKey, fill, stroke }) => {
  return <div>ChartArea</div>
}

export const ChartLineSeries = () => {
  return <div>ChartLineSeries</div>
}

export const ChartAxisOptions = ({ dataKey, tickLine, axisLine, tickMargin, tickFormatter }) => {
  return <div>ChartAxisOptions</div>
}

export const ChartXAxis = ({ dataKey }) => {
  return <div>ChartXAxis</div>
}

export const ChartYAxis = () => {
  return <div>ChartYAxis</div>
}

export const ChartBar = ({ dataKey, fill, radius }) => {
  return <div>ChartBar</div>
}

export const ChartBarSeries = () => {
  return <div>ChartBarSeries</div>
}
