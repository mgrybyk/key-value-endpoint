import { Schema, model, Document, Model } from 'mongoose'

interface StoreObject {
    key: string
    value: string
}

interface StoreModel extends Model<Document> {
    getValueByKey: (key: string) => Promise<string>
    setKeyValue: (key: string, value: string) => Promise<void>
}

const schema = new Schema({
    key: { type: String, unique: true, index: true, required: true, minlength: 1, maxlength: 128 },
    value: { type: String, required: true, maxlength: 1024 },
})

schema.statics.getValueByKey = async (key: string) => {
    const res = await StoreModel.findOne({ key }).exec()
    return res ? ((res.toObject() as unknown) as StoreObject).value : res
}

schema.statics.setKeyValue = async (key: string, value: string) => {
    await new StoreModel({ key, value }).validate()
    await StoreModel.updateOne({ key }, { key, value }, { upsert: true, runValidators: true }).exec()
}

const StoreModel = model('Store', schema)

export default StoreModel as StoreModel
