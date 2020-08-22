const LineModel = require("../../model/platform/line");
const { getClient } = require("bottender");
const LineClient = getClient("line");

exports.getRankDatas = async (req, res) => {
  const { groupId } = req.params;

  try {
    var rankDatas = await LineModel.getGroupSpeakRank(groupId);

    var result = await Promise.all(
      rankDatas.map(async data => {
        let { displayName } = await LineClient.getGroupMemberProfile(groupId, data.UserId);
        let temp = {
          userId: data.UserId,
          displayName: displayName,
          status: data.Status,
          speakTimes: data.SpeakTimes,
          lastSpeakTS: new Date(parseInt(data.LastSpeakDTM)).getTime(),
          joinedTS: new Date(parseInt(data.JoinedDTM)).getTime(),
          leftTS: data.LeftDTM === null ? null : new Date(parseInt(data.LeftDTM)).getTime(),
        };

        if (displayName === null || displayName === undefined) {
          temp.status = 0;
          temp.speakTimes = 0;
        }

        return temp;
      })
    );
  } catch (e) {
    result = { status: "failed", message: "something wrong" };
  }

  res.json(result);
};