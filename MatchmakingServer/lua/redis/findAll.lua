local keys = redis.pcall("KEYS", ARGV[1]);
return redis.pcall("MGET", unpack(keys));