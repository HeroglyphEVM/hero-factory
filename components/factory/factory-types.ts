
export type HeroTokenFormType = {
  type: "hero"
  isPro: boolean
  coinName: string
  symbol: string
  maxSupply: string
  preMintAmount: string
  rewardsPerBlock: string
  maxBonusRewardAfterOneDay: string
  image: File | null
  treasury?: string
  feePayer?: string
  crossChainFee?: string
  lzGasLimit?: string
  owner?: string
}

export type HeroKeyFormType = {
  type: "key"
  isPro: boolean
  coinName: string
  symbol: string
  maxSupply: string
  image: File | null
  paymentToken?: string
  baseCost?: string
  costIncrement?: string
  lzGasLimit?: string
  feePayer?: string
  treasury?: string
  owner?: string
}

export type TokenFormData = HeroTokenFormType
export type KeyFormData = HeroKeyFormType
