import crypto from "crypto";
import config from '../../config/config'
const {secret} = config

export const encryptToken = () => {
    const algorithm = 'aes-192-cbc';

    const password = 'bncaskdbvasbvlaslslasfhj';
  
    const key = crypto.scryptSync(password, 'GfG', 24);
  
    const iv = Buffer.alloc(16, 0);
    const timeEncoded = crypto.createCipheriv(algorithm, key, iv);

    const timeIssued = new Date();
    let encodedTimeStamp = timeEncoded.update(
        timeIssued.toString(),
        "utf8",
        "hex"
    );
    encodedTimeStamp += timeEncoded.final("hex");
    return encodedTimeStamp;
};

export const decryptToken = token => {
    const algorithm = 'aes-192-cbc';

    const password = 'bncaskdbvasbvlaslslasfhj';
  
    const key = crypto.scryptSync(password, 'GfG', 24);
  
    const iv = Buffer.alloc(16, 0);
    const timeDecoded = crypto.createDecipheriv(algorithm, key, iv);
    let decodedTime = timeDecoded.update(token, "hex", "utf8");
    decodedTime += timeDecoded.final("utf8");

    return decodedTime;
};

export const getTimeDifference = time => {
  const timeIssued = new Date(time);
  const presentTime = new Date();
  const timeDifference = presentTime.getTime() - timeIssued.getTime();
  return timeDifference / 1000;
};