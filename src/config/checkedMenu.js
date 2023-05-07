/**
 * Tree组件的配置文件，如果不这样写，直接写在Tree组件内，那实在太复杂了
 */
import MenuList from "./menuConfig";
function getTreeData(menuList) {
  return menuList.reduce((pre, item) => {
    const { key, children, label } = item;
    if (children) {
      // 有孩子节点
      pre.push({ key, title: label, children: getTreeData(children) });
    } else {
      // 没有孩子结点
      if (label.props.children === "角色管理") {
        pre.push({
          key,
          title: label.props.children,
          children,
          disableCheckbox: true,
        });
      } else {
        pre.push({ key, title: label.props.children, children });
      }
    }
    return pre;
  }, []);
}
/**
 * treeData 是树形结构的数组
 * 每个元素是个对象，包含 title key children属性
 * 可以根据 MenuList 数组生成
 */
export const treeData = [
  { key: "all", title: "角色权限", children: getTreeData(MenuList) },
];

console.log(treeData);
