local keys = redis.pcall("KEYS", ARGV[1]);
if #keys == 0 then
    return;
else
    return redis.pcall("MGET", unpack(keys));
end