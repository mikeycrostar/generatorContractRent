export interface ContractModel {
    landlord: string,
    tenant: string,
    addressTenant: string,
    cost: number,
    costWords: string,
    currency: string,
    monthFrom?: string,
    monthTo?: string,
    dates: [],
    city: string,
    signature: string
}
