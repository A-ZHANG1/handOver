export function translateState(state) {
  switch (state) {
    case 'released': return '已发布'
    case 'cancelled': return '已取消'
    case 'accepted': return '已接单'
    case 'cancelledO': return '申请人提出取消'
    case 'cancelledP': return '递客提出取消'
    case 'cancelledOP': return '已协商取消'
    case 'received': return '已送达'
    case 'signed': return '已签收'
    case 'refused': return '已拒签'
    case 'express': return '跑腿'
    case 'purchase': return '代购'
    case 'on': return '已取件'
    case 'off': return '未取件'
    case 'paid': return '已支付'
    case 'alipay': return '支付宝'
    case 'wechat': return '微信支付'
    case 'unionpay': return '银联'
    default: return '无法识别'
  }
}
