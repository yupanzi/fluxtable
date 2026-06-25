export default function groupBy2<T, K extends string | number>(list: T[], iteratee: (t: T) => K) {
  const groups = new Map<K, T[]>()

  for (const item of list) {
    const key = iteratee(item)
    let group = groups.get(key)
    if (group == null) {
      group = []
      groups.set(key, group)
    }
    group.push(item)
  }
  return groups
}
