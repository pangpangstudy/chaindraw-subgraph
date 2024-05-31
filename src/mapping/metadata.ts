import { json, Bytes, dataSource, log, Address } from "@graphprotocol/graph-ts";

import { NFTMetadata } from "../types/schema";

export function handleMetadata(content: Bytes): void {
  let nftMetadata = new NFTMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();
  if (value) {
    let name = value.get("name");
    let description = value.get("description");
    let image = value.get("image");
    let attributes = value.get("attributes");

    if (name) {
      nftMetadata.name = name.toString();
      log.info(name.toString(), []);
    }
    if (description) {
      nftMetadata.description = description.toString();
    }
    if (image) {
      nftMetadata.image = image.toString();
      log.info(image.toString(), []);
    }
    if (attributes) {
      let attributesObj = attributes.toObject();
      let concertName = attributesObj.get("concert_name");
      let address = attributesObj.get("address");

      if (concertName) {
        nftMetadata.concertName = concertName.toString();
        log.info(concertName.toString(), []);
      }
      if (address) {
        nftMetadata.address = address.toString();
        log.info(address.toString(), []);
      }
    }
    nftMetadata.save();
  }
}
